load("@angular//:index.bzl", "ng_module")
load("//demo/highlight/prism:prism.bzl", "prismjs")
load("//demo/highlight/snippets:snippets.bzl", "snippets")

def demoComponent(widget, demos, glob):
    demoHtml = ["{widget}/demos/{demo}/{widget}-{demo}.html".format(widget=widget, demo=demo) for demo in demos]
    demoTs = ["{widget}/demos/{demo}/{widget}-{demo}.ts".format(widget=widget, demo=demo) for demo in demos]
    prismjs(
        name = "{widget}-prismjs".format(widget=widget),
        srcs = demoHtml + demoTs
    )
    snippets(
        name = "{widget}-snippets".format(widget=widget),
        widget = widget,
        output = "{widget}/demos/snippets.ts".format(widget=widget),
        demos = demos
    )
    ng_module(
        name = "{widget}-module".format(widget=widget),
        srcs = [
            ":{widget}-prismjs".format(widget=widget),
            ":{widget}-snippets".format(widget=widget),
            "{widget}/index.ts".format(widget=widget),
            "{widget}/demos/index.ts".format(widget=widget),
            "{widget}/{widget}.component.ts".format(widget=widget),
        ] + demoTs,
        assets = glob(["{widget}/**/*.html".format(widget=widget)]),
        tsconfig = "//:tsconfig.json",
        deps = [
            "//demo/src/app/shared",
            "//demo/src/app/components/shared",
            "//src",
            "@rxjs",
        ]
    )

def allDemoComponents(glob):
    indexFiles = glob(["*/demos/index.ts"])
    widgets = [indexFile.rsplit("/")[0] for indexFile in indexFiles]
    for widget in widgets:
        demoFiles = glob(["{widget}/demos/*/*.ts".format(widget=widget)])
        demoNames = [demoFile.rsplit("/")[2] for demoFile in demoFiles]
        demoComponent(
            widget = widget,
            demos = demoNames,
            glob = glob
        )
    ng_module(
        name = "components",
        srcs = ["index.ts"],
        tsconfig = "//:tsconfig.json",
        deps = [
            "//demo/src/app/shared",
            "//demo/src/app/components/shared",
            "//src",
            "@rxjs",
        ] + [":{widget}-module".format(widget=widget) for widget in widgets]
    )
