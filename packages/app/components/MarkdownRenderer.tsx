import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../context/ThemeContext';

interface MarkdownRendererProps {
  content: string;
  style?: ViewStyle;
}

export function MarkdownRenderer({ content, style }: MarkdownRendererProps) {
  const { theme } = useTheme();

  const markdownStyles = StyleSheet.create({
    body: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    heading1: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 16,
    },
    heading2: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 14,
    },
    heading3: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 12,
    },
    paragraph: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
    },
    code_inline: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.error,
      fontFamily: 'monospace',
      fontSize: 13,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    code_block: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
    },
    fence: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      fontFamily: 'monospace',
      fontSize: 13,
      color: theme.colors.text,
    },
    blockquote: {
      borderLeftColor: theme.colors.primary,
      borderLeftWidth: 4,
      paddingLeft: 12,
      marginVertical: 8,
      opacity: 0.8,
    },
    list_item: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    bullet_list: {
      marginVertical: 4,
    },
    ordered_list: {
      marginVertical: 4,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    hr: {
      backgroundColor: theme.colors.border,
      height: 1,
      marginVertical: 16,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginVertical: 8,
    },
    thead: {
      fontWeight: 'bold',
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <View style={style}>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
}
