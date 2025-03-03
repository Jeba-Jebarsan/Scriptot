import { memo } from 'react';
import { Markdown } from './Markdown';
import type { JSONValue } from 'ai';

interface AssistantMessageProps {
  content: string | Array<{ type: string; text?: string; image?: string }>;
  isStreaming?: boolean;
  annotations?: JSONValue[];
}

export const AssistantMessage = memo(({ content, isStreaming, annotations }: AssistantMessageProps) => {
  const contentStr = typeof content === 'string' ? content : content.map((c) => c.text || '').join('');
  const filteredAnnotations = (annotations?.filter(
    (annotation: JSONValue) => annotation && typeof annotation === 'object' && Object.keys(annotation).includes('type')
  ) || []) as { type: string; value: any }[];

  const usage: {
    completionTokens: number;
    promptTokens: number;
    totalTokens: number;
  } = filteredAnnotations.find((annotation) => annotation.type === 'usage')?.value;

  return (
    <div className="overflow-hidden w-full">
      {usage && (
        <div className="text-sm text-bolt-elements-textSecondary mb-2">
          Tokens: {usage.totalTokens} (prompt: {usage.promptTokens}, completion: {usage.completionTokens})
        </div>
      )}
      <Markdown html>{contentStr}</Markdown>
    </div>
  );
});
