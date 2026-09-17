
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
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"experiment_id","req":false,"short":"The ID of the associated experiment, if any","type":"`$STRING`","index$":0},{"active":true,"name":"is_experiment_active","req":false,"short":"Whether the associated experiment is currently active","type":"`$BOOLEAN`","index$":1},{"active":true,"name":"is_qa_tester","req":false,"short":"Whether the user was identified as a QA tester","type":"`$BOOLEAN`","index$":2},{"active":true,"name":"variant_key","req":true,"short":"The key of the selected variant","type":"`$STRING`","index$":3},{"active":true,"name":"variant_value","req":true,"short":"The value of the selected variant (can be any type)","type":"`$ANY`","union":{"branches":4,"count":1,"depth":0},"index$":4}],"name":"flag","op":{"load":{"input":"data","name":"load","points":[{"active":true,"args":{"query":[{"active":true,"example":"%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22","kind":"query","name":"context","orig":"context","reqd":true,"type":"`$STRING`","index$":0},{"active":true,"kind":"query","name":"project_id","orig":"project_id","reqd":false,"type":"`$STRING`","index$":1},{"active":true,"kind":"query","name":"token","orig":"token","reqd":false,"type":"`$STRING`","index$":2}]},"contract":{"id":"GET /flags","json":"{\"operationId\":\"get-variant-assignments\",\"parameters\":[{\"description\":\"Your project token\",\"in\":\"query\",\"name\":\"token\",\"required\":false,\"schema\":{\"type\":\"string\"}},{\"description\":\"The Mixpanel project_id. Provide if using service account auth.\",\"in\":\"query\",\"name\":\"project_id\",\"required\":false,\"schema\":{\"type\":\"string\"}},{\"description\":\"URL-encoded JSON object containing evaluation context with distinct_id (required) and optional device_id and custom_properties object\",\"example\":\"%7B++%22distinct_id%22%3A%22user123%22%2C++%22device_id%22%3A%22device456%22%2C++%22custom_properties%22%3A+%7B++++%22some_key%22%3A+%22some_value%22%2C++++%22another_key%22%3A+32++%7D%7D%22\",\"in\":\"query\",\"name\":\"context\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Response containing evaluated feature flags for the user\",\"properties\":{\"flags\":{\"additionalProperties\":{\"description\":\"The selected variant for a feature flag\",\"properties\":{\"experiment_id\":{\"description\":\"The ID of the associated experiment, if any\",\"example\":\"exp_123\",\"type\":\"string\"},\"is_experiment_active\":{\"description\":\"Whether the associated experiment is currently active\",\"example\":true,\"type\":\"boolean\"},\"is_qa_tester\":{\"description\":\"Whether the user was identified as a QA tester\",\"example\":false,\"type\":\"boolean\"},\"variant_key\":{\"description\":\"The key of the selected variant\",\"example\":\"treatment\",\"type\":\"string\"},\"variant_value\":{\"description\":\"The value of the selected variant (can be any type)\",\"example\":true,\"oneOf\":[{\"type\":\"string\"},{\"type\":\"number\"},{\"type\":\"boolean\"},{\"type\":\"object\"}]}},\"required\":[\"variant_key\",\"variant_value\"],\"title\":\"SelectedVariant\",\"type\":\"object\"},\"description\":\"Map of flag keys to their selected variants\",\"example\":{\"new_checkout_flow\":{\"experiment_id\":\"exp_123\",\"is_experiment_active\":true,\"variant_key\":\"treatment\",\"variant_value\":true}},\"type\":\"object\"}},\"required\":[\"flags\"],\"title\":\"EvaluateFlagsResponse\",\"type\":\"object\"}}},\"description\":\"Success\"},\"400\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Standard error response\",\"properties\":{\"error\":{\"description\":\"Details about the error that occurred\",\"type\":\"string\"},\"status\":{\"enum\":[\"error\"],\"type\":\"string\"}},\"title\":\"ErrorResponse\",\"type\":\"object\"}}},\"description\":\"Bad request\"},\"401\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Standard error response\",\"properties\":{\"$ref\":\"#/responses/400/content/application~1json/schema/properties\"},\"title\":\"ErrorResponse\",\"type\":\"object\"}}},\"description\":\"Unauthorized\"},\"403\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Standard error response\",\"properties\":{\"$ref\":\"#/responses/400/content/application~1json/schema/properties\"},\"title\":\"ErrorResponse\",\"type\":\"object\"}}},\"description\":\"Forbidden\"}},\"security\":[{\"ProjectSecret\":[]},{\"ServiceAccount\":[]}],\"securitySchemes\":{\"OAuthToken\":{\"description\":\"OAuth Token\",\"scheme\":\"bearer\",\"type\":\"http\"},\"ProjectSecret\":{\"description\":\"Project Secret\",\"scheme\":\"basic\",\"type\":\"http\"},\"ServiceAccount\":{\"description\":\"Service Account\",\"scheme\":\"basic\",\"type\":\"http\"}},\"securitySource\":\"operation\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/flags","segments":[{"lit":"flags"}],"select":{"exist":["context","project_id","token"]},"transform":{"req":"`reqdata`","res":"`body.flags`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"flag","name__orig":"flag","Name":"Flag","name_":"flag","name-":"flag","NAME":"FLAG","index$":1}, {"active":true,"entity":"flag","key$":"BasicFlagFlow","kind":"basic","name":"BasicFlagFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"flag_ref01","srcdatavar":"flag_ref01_data","suffix":"_dt0"},"match":{},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-flag_ref01"}}],"index$":0}]}, 'Flag')
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
  
