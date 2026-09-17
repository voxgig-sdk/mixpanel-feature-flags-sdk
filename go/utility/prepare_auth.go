package utility

import (
	"encoding/base64"

	vs "github.com/voxgig-sdk/mixpanel-feature-flags-sdk/go/utility/struct"

	"github.com/voxgig-sdk/mixpanel-feature-flags-sdk/go/core"
)

const credName = "authorization"
const optionApikey = "apikey"
const optionSecret = "secret"
const notFound = "__NOTFOUND__"

func prepareAuthUtil(ctx *core.Context) (*core.Spec, error) {
	spec := ctx.Spec
	if spec == nil {
		return nil, ctx.MakeError("auth_no_spec",
			"Expected context spec property to be defined.")
	}

	headers := spec.Headers
	options := ctx.Client.OptionsMap()

	// Public APIs that need no auth omit the options.auth block entirely.
	if options["auth"] == nil {
		delete(headers, credName)
		return spec, nil
	}

	apikey := vs.GetProp(options, optionApikey, notFound)

	skip := false
	if apikey == nil {
		skip = true
	} else if apikeyStr, ok := apikey.(string); ok &&
		(apikeyStr == notFound || apikeyStr == "") {
		skip = true
	}

	// True HTTP Basic Auth needs TWO credentials, base64-joined - a single
	// token in the header (the branch below) can never authenticate against
	// an API that actually checks `Authorization: Basic base64(user:pass)`.
	if basicAuth, _ := vs.GetPath(options, []any{"auth", "basic"}).(bool); basicAuth {
		secret := vs.GetProp(options, optionSecret, notFound)

		noSecret := false
		if secret == nil {
			noSecret = true
		} else if secretStr, ok := secret.(string); ok &&
			(secretStr == notFound || secretStr == "") {
			noSecret = true
		}

		if skip || noSecret {
			delete(headers, credName)
		} else {
			apikeyVal, _ := apikey.(string)
			secretVal, _ := secret.(string)
			b64 := base64.StdEncoding.EncodeToString([]byte(apikeyVal + ":" + secretVal))

			basicPrefix := ""
			if ap := vs.GetPath(options, []any{"auth", "prefix"}); ap != nil {
				basicPrefix, _ = ap.(string)
			}
			// Empty prefix (raw apiKey credential) must not add a leading space.
			if basicPrefix == "" {
				headers[credName] = b64
			} else {
				headers[credName] = basicPrefix + " " + b64
			}
		}

		return spec, nil
	}

	if skip {
		delete(headers, credName)
	} else {
		authPrefix := ""
		if ap := vs.GetPath(options, []any{"auth", "prefix"}); ap != nil {
			authPrefix, _ = ap.(string)
		}
		apikeyVal := ""
		if av, ok := apikey.(string); ok {
			apikeyVal = av
		}
		// Empty prefix (raw apiKey credential) must not add a leading space.
		if authPrefix == "" {
			headers[credName] = apikeyVal
		} else {
			headers[credName] = authPrefix + " " + apikeyVal
		}
	}

	return spec, nil
}
