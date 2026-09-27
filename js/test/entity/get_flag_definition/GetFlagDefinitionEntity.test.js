
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


describe('GetFlagDefinitionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MIXPANEL_FEATURE_FLAGS_TEST_LIVE=TRUE.
  afterEach(liveDelay('MIXPANEL_FEATURE_FLAGS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MixpanelFeatureFlagsSDK.test()
    const ent = testsdk.GetFlagDefinition()
    assert(null != ent)
  })


  test('basic', async (t) => {

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"context":{"a":true,"h":"Context","n":"context","r":true,"sh":"The context variable used for flag evaluation (e.g., distinct_id, device_id)","t":"`$STRING`","key$":"context","index$":0},"experiment_id":{"a":true,"h":"Experiment Id","n":"experiment_id","r":false,"sh":"ID of the associated experiment, if any","t":"`$STRING`","key$":"experiment_id","index$":1},"id":{"a":true,"h":"Id","n":"id","r":true,"sh":"Unique identifier for the flag","t":"`$STRING`","key$":"id","index$":2},"is_experiment_active":{"a":true,"h":"Is Experiment Active","n":"is_experiment_active","r":false,"sh":"Whether the associated experiment is currently active","t":"`$BOOLEAN`","key$":"is_experiment_active","index$":3},"key":{"a":true,"h":"Key","n":"key","r":true,"sh":"Unique key used to reference the flag","t":"`$STRING`","key$":"key","index$":4},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Human-readable name of the flag","t":"`$STRING`","key$":"name","index$":5},"project_id":{"a":true,"fo":"int32","h":"Project Id","n":"project_id","r":true,"sh":"ID of the project this flag belongs to","t":"`$INTEGER`","key$":"project_id","index$":6},"ruleset":{"a":true,"h":"Ruleset","n":"ruleset","r":true,"sh":"Complete ruleset for a feature flag including variants and rollout configuration","t":"`$OBJECT`","union":{"branches":4,"count":1,"depth":5},"key$":"ruleset","index$":7},"status":{"a":true,"h":"Status","n":"status","r":true,"sh":"Current status of the flag","t":"`$STRING`","key$":"status","index$":8},"workspace_id":{"a":true,"fo":"int64","h":"Workspace Id","n":"workspace_id","r":true,"sh":"ID of the workspace (dataview) this flag belongs to","t":"`$INTEGER`","key$":"workspace_id","index$":9}},"id":{"field":"id","name":"id"},"name":"get_flag_definition","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /flags/definitions","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"project_id","or":"project_id","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"token","or":"token","r":false,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/flags/definitions","q":{"exist":["project_id","token"]},"r":{},"s":[{"lit":"flags"},{"lit":"definitions"}],"t":{"req":"`reqdata`","res":"`body.flags`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"get_flag_definition","name__orig":"get_flag_definition","Name":"GetFlagDefinition","name_":"get_flag_definition","name-":"get-flag-definition","NAME":"GET_FLAG_DEFINITION","index$":1}, {"active":true,"entity":"get_flag_definition","key$":"BasicGetFlagDefinitionFlow","kind":"basic","name":"BasicGetFlagDefinitionFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"get_flag_definition_ref01"}}],"index$":0}]}, 'GetFlagDefinition', {"GET /flags/definitions":{"protocol":"http","parameters":[{"name":"token","in":"query","schema":{"type":"string"},"description":"Your project token","required":false,"x-ref":"#/components/parameters/ProjectToken","index$":0},{"name":"project_id","in":"query","schema":{"type":"string"},"description":"The Mixpanel project_id. Provide if using service account auth.","required":false,"x-ref":"#/components/parameters/ProjectId","index$":1}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let get_flag_definition_ref01_data = Object.values(setup.data.existing.get_flag_definition)[0]

    // LIST
    const get_flag_definition_ref01_ent = client.GetFlagDefinition()
    const get_flag_definition_ref01_match = {}

    const get_flag_definition_ref01_list = (await get_flag_definition_ref01_ent.list(get_flag_definition_ref01_match)).map((e) => e.data())


  })
})



function basicSetup(extra) {
  // TODO: fix test def options
  const options = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname,
      '../../../../.sdk/test/entity/get_flag_definition/GetFlagDefinitionTestData.json')

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
    ['get_flag_definition01','get_flag_definition02','get_flag_definition03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID': idmap,
    'MIXPANEL_FEATURE_FLAGS_TEST_LIVE': 'FALSE',
    'MIXPANEL_FEATURE_FLAGS_TEST_EXPLAIN': 'FALSE',
    'MIXPANEL_FEATURE_FLAGS_APIKEY': '',
    'MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN': "api.mixpanel",
  })

  idmap = env['MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID']

  const live = 'TRUE' === env.MIXPANEL_FEATURE_FLAGS_TEST_LIVE
  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MIXPANEL_FEATURE_FLAGS_TEST_GET_FLAG_DEFINITION_ENTID']
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
  
