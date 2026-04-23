"use client";

import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type RichText = { plain_text: string }[];

function plainText(rt: RichText) {
  return rt.map((t) => t.plain_text).join("");
}

export default function NotionBlock({ block }: { block: BlockObjectResponse }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="block block-paragraph">
          {plainText(block.paragraph.rich_text) || " "}
        </p>
      );
    case "heading_1":
      return <h1 className="block block-heading1">{plainText(block.heading_1.rich_text)}</h1>;
    case "heading_2":
      return <h2 className="block block-heading2">{plainText(block.heading_2.rich_text)}</h2>;
    case "heading_3":
      return <h3 className="block block-heading3">{plainText(block.heading_3.rich_text)}</h3>;
    case "bulleted_list_item":
      return <li className="block block-bulleted">{plainText(block.bulleted_list_item.rich_text)}</li>;
    case "numbered_list_item":
      return <li className="block block-numbered">{plainText(block.numbered_list_item.rich_text)}</li>;
    case "code":
      return <pre className="block block-code">{plainText(block.code.rich_text)}</pre>;
    case "quote":
      return <blockquote className="block block-quote">{plainText(block.quote.rich_text)}</blockquote>;
    case "divider":
      return <hr className="block-divider" />;
    default:
      return null;
  }
}
