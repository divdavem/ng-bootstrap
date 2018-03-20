def _impl(ctx):
    ctx.actions.run(
        inputs=[],
        outputs=[ctx.outputs.output],
        arguments=[ctx.outputs.output.path],
        progress_message="Writing version number in %s" % ctx.outputs.output.short_path,
        executable=ctx.executable._buildDoc
    )

version = rule(
    implementation=_impl,
    attrs={
        "output": attr.output(mandatory=True),
        "_buildDoc": attr.label(executable=True, cfg="host", allow_files=True, default=Label("//misc:version")),
    },
)
