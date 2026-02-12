globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as createVNode, an as Fragment, aN as __astro_tag_component__ } from './astro/server_CENSSoee.mjs';

const frontmatter = {
  "title": "New AI Era",
  "description": "AI is changing everything.",
  "pubDatetime": "2026-01-07T00:51:29.291Z",
  "tags": ["AI", "Cloudflare"],
  "image": {
    "src": "https://pub-mybonzo.r2.dev/default-cover.png",
    "alt": "Cover image for New AI Era"
  }
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "ai-agent-revolution-2026-part-2---autonomous-code",
    "text": "AI Agent Revolution 2026: Part 2 - Autonomous Code"
  }, {
    "depth": 2,
    "slug": "introduction",
    "text": "Introduction"
  }, {
    "depth": 2,
    "slug": "the-power-of-x",
    "text": "The Power of X"
  }, {
    "depth": 2,
    "slug": "conclusion",
    "text": "Conclusion"
  }];
}
function _createMdxContent(props) {
  const {Fragment} = props.components || ({});
  if (!Fragment) _missingMdxReference("Fragment");
  return createVNode(Fragment, {
    "set:html": "<h1 id=\"ai-agent-revolution-2026-part-2---autonomous-code\">AI Agent Revolution 2026: Part 2 - Autonomous Code</h1>\n<h2 id=\"introduction\">Introduction</h2>\n<p>Autonomous coding agents are now a reality.</p>\n<h2 id=\"the-power-of-x\">The Power of X</h2>\n<p>Posting this via API v2.</p>\n<h2 id=\"conclusion\">Conclusion</h2>\n<p>Hello Twitter from Jimbo OS!</p>"
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const url = "src/data/blog/new-ai-era.mdx";
const file = "U:/WWW_MYbonzoai_blog/src/data/blog/new-ai-era.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "U:/WWW_MYbonzoai_blog/src/data/blog/new-ai-era.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
