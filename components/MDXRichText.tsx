import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { media } from 'utils/media';
import ArticleImage from './ArticleImage';
import Code from './Code';
import Link from './Link';
import Quote from './Quote';

export default function RichText({ content }: { content: string | any }) {
  if (!content) return null;

  // If content is an object with a body or string
  const rawText = typeof content === 'string' ? content : (content?.text || JSON.stringify(content));

  // Custom parser/renderer to handle embedded JSX tags in markdown like <Quote ... />, <ArticleImage ... />, <Code ... />
  const renderContentWithCustomTags = (text: string) => {
    // Split by custom tags <Quote ... />, <ArticleImage ... />, <Code ... />
    const parts: React.ReactNode[] = [];
    const tagRegex = /<(Quote|ArticleImage|Code)\s+([^>]*?)(?:\/>|>[\s\S]*?<\/\1>)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        const markdownChunk = text.substring(lastIndex, matchIndex);
        parts.push(
          <ReactMarkdown
            key={`md-${lastIndex}`}
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, ...props }) => <SecondHeading {...props} />,
              h3: ({ node, ...props }) => <ThirdHeading {...props} />,
              p: ({ node, ...props }) => <Paragraph {...props} />,
              a: ({ node, href, children, ...props }) => (
                <Link href={href || '#'} {...props}>
                  {children}
                </Link>
              ),
              code: ({ node, className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return <TextHighlight {...props}>{children}</TextHighlight>;
                }
                const matchLang = /language-(\w+)/.exec(className || '');
                return (
                  <Code
                    code={String(children).replace(/\n$/, '')}
                    language={matchLang ? matchLang[1] : 'javascript'}
                  />
                );
              },
            }}
          >
            {markdownChunk}
          </ReactMarkdown>
        );
      }

      const tagName = match[1];
      const attrString = match[2];

      // Parse attributes
      const attrs: Record<string, string> = {};
      const attrRegex = /(\w+)=(?:{`([\s\S]*?)`}|{"([^"]*?)"}|"([^"]*?)"|'([^']*?)')/g;
      let attrMatch: RegExpExecArray | null;
      while ((attrMatch = attrRegex.exec(attrString)) !== null) {
        attrs[attrMatch[1]] = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? attrMatch[5] ?? '';
      }

      if (tagName === 'Quote') {
        parts.push(
          <Quote
            key={`tag-${matchIndex}`}
            content={attrs.content || ''}
            author={attrs.author || ''}
            cite={attrs.cite || ''}
          />
        );
      } else if (tagName === 'ArticleImage') {
        parts.push(<ArticleImage key={`tag-${matchIndex}`} src={attrs.src || ''} alt={attrs.alt || ''} />);
      } else if (tagName === 'Code') {
        parts.push(
          <Code
            key={`tag-${matchIndex}`}
            code={attrs.code || ''}
            language={attrs.language || 'javascript'}
          />
        );
      }

      lastIndex = tagRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingChunk = text.substring(lastIndex);
      parts.push(
        <ReactMarkdown
          key={`md-${lastIndex}`}
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => <SecondHeading {...props} />,
            h3: ({ node, ...props }) => <ThirdHeading {...props} />,
            p: ({ node, ...props }) => <Paragraph {...props} />,
            a: ({ node, href, children, ...props }) => (
              <Link href={href || '#'} {...props}>
                {children}
              </Link>
            ),
            code: ({ node, className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return <TextHighlight {...props}>{children}</TextHighlight>;
              }
              const matchLang = /language-(\w+)/.exec(className || '');
              return (
                <Code
                  code={String(children).replace(/\n$/, '')}
                  language={matchLang ? matchLang[1] : 'javascript'}
                />
              );
            },
          }}
        >
          {remainingChunk}
        </ReactMarkdown>
      );
    }

    return parts;
  };

  return <Container>{renderContentWithCustomTags(rawText)}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  section:not(:last-child) {
    margin-bottom: 3.8rem;
  }

  a {
    word-break: break-word;
  }

  ${media('<=desktop')} {
    .remark-highlight {
      width: 100%;
      overflow-x: auto;
    }
  }

  ol,
  ul {
    font-size: 1.8rem;
    line-height: 2.7rem;
    margin: 0;
    padding-left: 2.4rem;
    li {
      & > * {
        vertical-align: top;
      }
    }

    &:not(:last-child) {
      margin-bottom: 2.7rem;
    }
  }
`;

const Paragraph = styled.p`
  font-size: 1.8rem;
  line-height: 2.7rem;
  hanging-punctuation: first;

  &:not(:last-child) {
    margin-bottom: 2.7rem;
  }

  & + ul,
  & + li {
    margin-top: -1.5rem !important;
  }
`;

const SecondHeading = styled.h2`
  font-size: 2.5rem;
  line-height: 3.75rem;
  margin-bottom: 3.75rem;
`;

const ThirdHeading = styled.h3`
  font-size: 2.2rem;
  line-height: 3.4rem;
  margin-bottom: 3.4rem;
`;

const TextHighlight = styled.code`
  display: inline-block;
  padding: 0 0.6rem;
  color: rgb(var(--textSecondary));
  border-radius: 0.4rem;
  background-color: rgba(var(--primary), 0.8);
  font-size: 1.6rem;
  font-family: inherit;
`;
