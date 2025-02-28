import type { ProviderInfo } from '~/types/model';
import { useEffect } from 'react';
import type { ModelInfo } from '~/lib/modules/llm/types';

interface ModelSelectorProps {
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  modelList: ModelInfo[];
  providerList: ProviderInfo[];
  apiKeys: Record<string, string>;
  modelLoading?: string;
}

export const ModelSelector = ({
  model,
  setModel,
  provider,
  setProvider,
  modelList,
  providerList,
  modelLoading,
}: ModelSelectorProps) => {
  // Force set Google provider and Gemini 2.0 Pro model
  useEffect(() => {
    const googleProvider = providerList.find(p => p.name === 'Google');
    if (googleProvider && setProvider) {
      setProvider(googleProvider);
    }

    const geminiModel = modelList.find(m => m.name === 'gemini-exp-1206');
    if (geminiModel && setModel) {
      setModel(geminiModel.name);
    }
  }, [providerList, modelList, setProvider, setModel]);

  // Don't render any UI - hide the selector completely
  return null;
};