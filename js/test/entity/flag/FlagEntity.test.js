
const envlocal = __dirname + '/../../../.env.local'
require('../../utility').loadEnvLocal(envlocal)

const Path = require('node:path')
const Fs = require('node:fs')

const { test, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const { createLiveTransport } = require('../../live-runner')
const { runLiveEntity } = require('../../live-entity')


const { MixpanelFeatureFlagsSDK, BaseFeature, stdutil, config } = require('../../..')

const {
  envOverride,
  liveClientOptions,
  liveDelay,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
} = require('../../utility')


describe('FlagEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MIXPANEL_FEATURE_FLAGS_TEST_LIVE=TRUE.
  afterEach(liveDelay('MIXPANEL_FEATURE_FLAGS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MixpanelFeatureFlagsSDK.test()
    const ent = testsdk.Flag()
    assert(null != ent)
  })


  test('basic', async (t) => {

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"experiment_id":{"a":true,"h":"Experiment Id","n":"experiment_id","r":false,"sh":"The ID of the associated experiment, if any","t":"`$STRING`","key$":"experiment_id","index$":0},"is_experiment_active":{"a":true,"h":"Is Experiment Active","n":"is_experiment_active","r":false,"sh":"Whether the associated experiment is currently active","t":"`$BOOLEAN`","key$":"is_experiment_active","index$":1},"is_qa_tester":{"a":true,"h":"Is Qa Tester","n":"is_qa_tester","r":false,"sh":"Whether the user was identified as a QA tester","t":"`$BOOLEAN`","key$":"is_qa_tester","index$":2},"variant_key":{"a":true,"h":"Variant Key","n":"variant_key","r":true,"sh":"The key of the selected variant","t":"`$STRING`","key$":"variant_key","index$":3},"variant_value":{"a":true,"h":"Variant Value","n":"variant_value","r":true,"sh":"The value of the selected variant (can be any type)","t":"`$ANY`","union":{"branches":4,"count":1,"depth":0},"key$":"variant_value","index$":4}},"name":"flag","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /flags","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22","k":"query","n":"context","or":"context","r":true,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"project_id","or":"project_id","r":false,"t":"`$STRING`","index$":1},{"a":true,"k":"query","n":"token","or":"token","r":false,"t":"`$STRING`","index$":2}]},"k":"http","m":"GET","o":"/flags","q":{"exist":["context","project_id","token"]},"r":{},"s":[{"lit":"flags"}],"t":{"req":"`reqdata`","res":"`body.flags`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"flag","name__orig":"flag","Name":"Flag","name_":"flag","name-":"flag","NAME":"FLAG","index$":0}, {"active":true,"entity":"flag","key$":"BasicFlagFlow","kind":"basic","name":"BasicFlagFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"flag_ref01","srcdatavar":"flag_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-flag_ref01"}}],"index$":0}]}, 'Flag', {"GET /flags":{"protocol":"http","parameters":[{"name":"token","in":"query","schema":{"type":"string"},"description":"Your project token","required":false,"x-ref":"#/components/parameters/ProjectToken","index$":0},{"name":"project_id","in":"query","schema":{"type":"string"},"description":"The Mixpanel project_id. Provide if using service account auth.","required":false,"x-ref":"#/components/parameters/ProjectId","index$":1},{"name":"context","in":"query","description":"URL-encoded JSON object containing evaluation context with distinct_id (required) and optional device_id and custom_properties object","required":true,"schema":{"type":"string"},"example":"%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22","index$":2}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let flag_ref01_data = Object.values(setup.data.existing.flag)[0]

    // LOAD
    const flag_ref01_ent = client.Flag()
    const flag_ref01_match_dt0 = {}
    const flag_ref01_data_dt0 = (await flag_ref01_ent.load(flag_ref01_match_dt0)).data()
    assert(null != flag_ref01_data_dt0)


  })
})



function basicSetup(extra) {
  // TODO: fix test def options
  const options = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname,
      '../../../../.sdk/test/entity/flag/FlagTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = MixpanelFeatureFlagsSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['flag01','flag02','flag03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MIXPANEL_FEATURE_FLAGS_TEST_FLAG_ENTID': idmap,
    'MIXPANEL_FEATURE_FLAGS_TEST_LIVE': 'FALSE',
    'MIXPANEL_FEATURE_FLAGS_TEST_EXPLAIN': 'FALSE',
    'MIXPANEL_FEATURE_FLAGS_APIKEY': '',
    'MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN': "api.mixpanel",
  })

  idmap = env['MIXPANEL_FEATURE_FLAGS_TEST_FLAG_ENTID']

  const live = 'TRUE' === env.MIXPANEL_FEATURE_FLAGS_TEST_LIVE
  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MIXPANEL_FEATURE_FLAGS_TEST_FLAG_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new MixpanelFeatureFlagsSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.MIXPANEL_FEATURE_FLAGS_APIKEY,
        server: {
          regionAndDomain: env.MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN,
        },
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when
      // the last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey and
      // server values above and handed the SDK undefined.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.MIXPANEL_FEATURE_FLAGS_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
