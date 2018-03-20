def _impl(ctx):
    ctx.actions.run(
        inputs=ctx.files.srcs,
        outputs=[ctx.outputs.output],
        arguments=[ctx.outputs.output.path]+[file.path for file in ctx.files.srcs],
        progress_message="Building API doc in %s" % ctx.outputs.output.short_path,
        executable=ctx.executable._buildDoc
    )

apidoc = rule(
    implementation=_impl,
    attrs={
        "srcs": attr.label_list(allow_files=True, mandatory=True),
        "output": attr.output(mandatory=True),
        "_buildDoc": attr.label(executable=True, cfg="host", allow_files=True, default=Label("//misc:buildDoc")),
    },
)
