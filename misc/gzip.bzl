def _impl(ctx):
    outputs = []
    for file in ctx.files.srcs:
        output = ctx.actions.declare_file(file.basename + ".gz", sibling=file)
        outputs.append(output)
        ctx.actions.run(
            inputs=[file],
            outputs=[output],
            arguments=[file.path, output.path],
            progress_message="Gzipping %s" % file.short_path,
            executable=ctx.executable._gzip
        )
    return DefaultInfo(files=depset(outputs))

gzip = rule(
    implementation=_impl,
    attrs={
        "srcs": attr.label_list(allow_files=True),
        "_gzip": attr.label(executable=True, cfg="host", allow_files=True, default=Label("//misc:gzip")),
    },
)
