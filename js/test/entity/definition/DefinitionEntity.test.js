
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


describe('DefinitionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MIXPANEL_FEATURE_FLAGS_TEST_LIVE=TRUE.
  afterEach(liveDelay('MIXPANEL_FEATURE_FLAGS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MixpanelFeatureFlagsSDK.test()
    const ent = testsdk.Definition()
    assert(null != ent)
  })


  test('basic', async (t) => {

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"context","req":true,"short":"The context variable used for flag evaluation (e.g., distinct_id, device_id)","type":"`$STRING`","index$":0},{"active":true,"name":"experiment_id","req":false,"short":"ID of the associated experiment, if any","type":"`$STRING`","index$":1},{"active":true,"name":"id","req":true,"short":"Unique identifier for the flag","type":"`$STRING`","index$":2},{"active":true,"name":"is_experiment_active","req":false,"short":"Whether the associated experiment is currently active","type":"`$BOOLEAN`","index$":3},{"active":true,"name":"key","req":true,"short":"Unique key used to reference the flag","type":"`$STRING`","index$":4},{"active":true,"name":"name","req":true,"short":"Human-readable name of the flag","type":"`$STRING`","index$":5},{"active":true,"format":"int32","name":"project_id","req":true,"short":"ID of the project this flag belongs to","type":"`$INTEGER`","index$":6},{"active":true,"name":"ruleset","req":true,"short":"Complete ruleset for a feature flag including variants and rollout configuration","type":"`$OBJECT`","union":{"branches":4,"count":1,"depth":5},"index$":7},{"active":true,"name":"status","req":true,"short":"Current status of the flag","type":"`$STRING`","index$":8},{"active":true,"format":"int64","name":"workspace_id","req":true,"short":"ID of the workspace (dataview) this flag belongs to","type":"`$INTEGER`","index$":9}],"id":{"field":"id","name":"id"},"name":"definition","op":{"list":{"input":"data","name":"list","points":[{"active":true,"args":{"query":[{"active":true,"kind":"query","name":"project_id","orig":"project_id","reqd":false,"type":"`$STRING`","index$":0},{"active":true,"kind":"query","name":"token","orig":"token","reqd":false,"type":"`$STRING`","index$":1}]},"contract":{"id":"GET /flags/definitions","json":"{\"operationId\":\"get-flag-definitions\",\"parameters\":[{\"description\":\"Your project token\",\"in\":\"query\",\"name\":\"token\",\"required\":false,\"schema\":{\"type\":\"string\"}},{\"description\":\"The Mixpanel project_id. Provide if using service account auth.\",\"in\":\"query\",\"name\":\"project_id\",\"required\":false,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Response containing all enabled feature flag definitions\",\"properties\":{\"flags\":{\"description\":\"Array of enabled feature flag definitions\",\"items\":{\"description\":\"Complete metadata for a feature flag\",\"properties\":{\"context\":{\"description\":\"The context variable used for flag evaluation (e.g., distinct_id, device_id)\",\"example\":\"device_id\",\"type\":\"string\"},\"experiment_id\":{\"description\":\"ID of the associated experiment, if any\",\"example\":\"exp_123\",\"type\":\"string\"},\"id\":{\"description\":\"Unique identifier for the flag\",\"example\":\"flag_abc123\",\"type\":\"string\"},\"is_experiment_active\":{\"description\":\"Whether the associated experiment is currently active\",\"example\":true,\"type\":\"boolean\"},\"key\":{\"description\":\"Unique key used to reference the flag\",\"example\":\"new_checkout_flow\",\"type\":\"string\"},\"name\":{\"description\":\"Human-readable name of the flag\",\"example\":\"New Checkout Flow\",\"type\":\"string\"},\"project_id\":{\"description\":\"ID of the project this flag belongs to\",\"example\":12345,\"format\":\"int32\",\"type\":\"integer\"},\"ruleset\":{\"description\":\"Complete ruleset for a feature flag including variants and rollout configuration\",\"properties\":{\"rollout\":{\"description\":\"Array of rollout rules defining how the flag is distributed\",\"items\":{\"description\":\"A rollout rule defining how a flag is distributed to a cohort\",\"properties\":{\"cohort_hash\":{\"description\":\"Hash of the cohort definition for lookup\",\"example\":\"cohort_abc123\",\"type\":\"string\"},\"rollout_percentage\":{\"description\":\"The percentage of the cohort that should receive this flag (0.0 to 1.0)\",\"example\":0.8,\"format\":\"double\",\"type\":\"number\"},\"runtime_evaluation_definition\":{\"additionalProperties\":true,\"deprecated\":true,\"description\":\"Key-value pairs that are evaluated at request time for cohort matching, replaced by the more powerful runtime_evaluation_rule\",\"example\":{\"platform\":\"web\"},\"type\":\"object\"},\"runtime_evaluation_rule\":{\"additionalProperties\":true,\"description\":\"JsonLogic rule that's evaluated at request time based on runtime parameters in the request\",\"example\":{\"platform\":\"web\"},\"type\":\"object\"},\"variant_override\":{\"deprecated\":true,\"description\":\"Override to force a specific variant for a rollout rule (replaced by variant_splits)\",\"properties\":{\"key\":{\"description\":\"The variant key to force\",\"example\":\"treatment\",\"type\":\"string\"}},\"title\":\"VariantOverride\",\"type\":\"object\"},\"variant_splits\":{\"additionalProperties\":{\"format\":\"double\",\"type\":\"number\"},\"description\":\"Dictionary mapping variant keys to their allocation splits within this rollout\",\"example\":{\"control\":0.5,\"treatment\":0.5},\"type\":\"object\"}},\"required\":[\"rollout_percentage\"],\"title\":\"Rollout\",\"type\":\"object\"},\"type\":\"array\"},\"test\":{\"description\":\"Mapping of test users to their assigned variants\",\"properties\":{\"users\":{\"additionalProperties\":{\"type\":\"string\"},\"description\":\"Map of distinct_id to variant_key for QA testing\",\"example\":{\"qa_user_1\":\"treatment\",\"qa_user_2\":\"control\"},\"type\":\"object\"}},\"title\":\"TestUsers\",\"type\":\"object\"},\"variants\":{\"description\":\"Array of variant definitions for this flag\",\"items\":{\"description\":\"A variant definition for a feature flag\",\"properties\":{\"is_control\":{\"description\":\"Whether this is the control variant\",\"example\":false,\"type\":\"boolean\"},\"is_sticky\":{\"description\":\"Whether users should stick to this variant once assigned\",\"example\":true,\"type\":\"boolean\"},\"key\":{\"description\":\"Unique key for this variant\",\"example\":\"treatment\",\"type\":\"string\"},\"split\":{\"description\":\"The proportion of users that should receive this variant (0.0 to 1.0)\",\"example\":0.5,\"format\":\"double\",\"type\":\"number\"},\"value\":{\"description\":\"The value for this variant (can be any type)\",\"example\":true,\"oneOf\":[{\"type\":\"string\"},{\"type\":\"number\"},{\"type\":\"boolean\"},{\"type\":\"object\"}]}},\"required\":[\"key\",\"value\",\"is_control\",\"split\"],\"title\":\"Variant\",\"type\":\"object\"},\"type\":\"array\"}},\"required\":[\"variants\",\"rollout\"],\"title\":\"RuleSet\",\"type\":\"object\"},\"status\":{\"description\":\"Current status of the flag\",\"enum\":[\"enabled\",\"disabled\",\"archived\"],\"example\":\"enabled\",\"type\":\"string\"},\"workspace_id\":{\"description\":\"ID of the workspace (dataview) this flag belongs to\",\"example\":67890,\"format\":\"int64\",\"type\":\"integer\"}},\"required\":[\"id\",\"name\",\"key\",\"status\",\"project_id\",\"workspace_id\",\"ruleset\",\"context\"],\"title\":\"ExperimentationFlagMetadata\",\"type\":\"object\"},\"type\":\"array\"}},\"required\":[\"flags\"],\"title\":\"FlagDefinitionsResponse\",\"type\":\"object\"}}},\"description\":\"Success\"},\"401\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Standard error response\",\"properties\":{\"error\":{\"description\":\"Details about the error that occurred\",\"type\":\"string\"},\"status\":{\"enum\":[\"error\"],\"type\":\"string\"}},\"title\":\"ErrorResponse\",\"type\":\"object\"}}},\"description\":\"Unauthorized\"},\"403\":{\"content\":{\"application/json\":{\"schema\":{\"description\":\"Standard error response\",\"properties\":{\"$ref\":\"#/responses/401/content/application~1json/schema/properties\"},\"title\":\"ErrorResponse\",\"type\":\"object\"}}},\"description\":\"Forbidden\"}},\"security\":[{\"ProjectSecret\":[]},{\"ServiceAccount\":[]}],\"securitySchemes\":{\"OAuthToken\":{\"description\":\"OAuth Token\",\"scheme\":\"bearer\",\"type\":\"http\"},\"ProjectSecret\":{\"description\":\"Project Secret\",\"scheme\":\"basic\",\"type\":\"http\"},\"ServiceAccount\":{\"description\":\"Service Account\",\"scheme\":\"basic\",\"type\":\"http\"}},\"securitySource\":\"operation\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/flags/definitions","segments":[{"lit":"flags"},{"lit":"definitions"}],"select":{"exist":["project_id","token"]},"transform":{"req":"`reqdata`","res":"`body.flags`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"definition","name__orig":"definition","Name":"Definition","name_":"definition","name-":"definition","NAME":"DEFINITION","index$":0}, {"active":true,"entity":"definition","key$":"BasicDefinitionFlow","kind":"basic","name":"BasicDefinitionFlow","param":{},"step":[{"active":true,"data":{},"input":{},"match":{},"op":"list","spec":[],"valid":[{"apply":"ItemExists","def":{"ref":"definition_ref01"}}],"index$":0}]}, 'Definition')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let definition_ref01_data = Object.values(setup.data.existing.definition)[0]

    // LIST
    const definition_ref01_ent = client.Definition()
    const definition_ref01_match = {}

    const definition_ref01_list = (await definition_ref01_ent.list(definition_ref01_match)).map((e) => e.data())


  })
})



function basicSetup(extra) {
  // TODO: fix test def options
  const options = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname,
      '../../../../.sdk/test/entity/definition/DefinitionTestData.json')

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
    ['definition01','definition02','definition03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MIXPANEL_FEATURE_FLAGS_TEST_DEFINITION_ENTID': idmap,
    'MIXPANEL_FEATURE_FLAGS_TEST_LIVE': 'FALSE',
    'MIXPANEL_FEATURE_FLAGS_TEST_EXPLAIN': 'FALSE',
    'MIXPANEL_FEATURE_FLAGS_APIKEY': '',
    'MIXPANEL_FEATURE_FLAGS_SERVER_REGIONANDDOMAIN': "api.mixpanel",
  })

  idmap = env['MIXPANEL_FEATURE_FLAGS_TEST_DEFINITION_ENTID']

  const live = 'TRUE' === env.MIXPANEL_FEATURE_FLAGS_TEST_LIVE
  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MIXPANEL_FEATURE_FLAGS_TEST_DEFINITION_ENTID']
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
  
