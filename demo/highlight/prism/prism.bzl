def _impl(ctx):
    outputs = []
    for file in ctx.files.srcs:
        output = ctx.actions.declare_file(file.basename + ".prismjs.ts", sibling=file)
        outputs.append(output)
        ctx.actions.run(
            inputs=[file],
            outputs=[output],
            arguments=[file.path, output.path],
            progress_message="Highlighting %s" % file.short_path,
            executable=ctx.executable._callPrism
        )
    return DefaultInfo(files=depset(outputs))

prismjs = rule(
    implementation=_impl,
    attrs={
        "srcs": attr.label_list(allow_files=True),
        "_callPrism": attr.label(executable=True, cfg="host", allow_files=True, default=Label("//demo/highlight/prism:callPrism")),
    },
)
