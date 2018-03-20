def _impl(ctx):
    ctx.actions.run(
        inputs=ctx.files.srcs,
        outputs=[ctx.outputs.out],
        arguments=[ctx.outputs.out.path]+[file.path for file in ctx.files.srcs],
        progress_message="Building %s" % ctx.outputs.out.short_path,
        executable=ctx.executable._concat
    )

concat = rule(
    implementation=_impl,
    attrs={
        "srcs": attr.label_list(allow_files=True, mandatory=True),
        "out": attr.output(mandatory=True),
        "_concat": attr.label(executable=True, cfg="host", allow_files=True, default=Label("//misc:concat")),
    },
)
