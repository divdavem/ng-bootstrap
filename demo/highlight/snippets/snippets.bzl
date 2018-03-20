def _impl(ctx):
    ctx.actions.run(
        inputs=[],
        outputs=[ctx.outputs.output],
        arguments=[ctx.outputs.output.path, ctx.attr.widget] + ctx.attr.demos,
        progress_message="Creating list of snippets in %s" % ctx.outputs.output.short_path,
        executable=ctx.executable._genSnippets
    )

snippets = rule(
    implementation=_impl,
    attrs={
        "widget": attr.string(mandatory=True),
        "demos": attr.string_list(mandatory=True),
        "output": attr.output(mandatory=True),
        "_genSnippets": attr.label(executable=True, cfg="host", allow_files=True, default=Label("//demo/highlight/snippets:genSnippets")),
    },
)
