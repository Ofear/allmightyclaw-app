import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
}

interface Token {
  text: string;
  type: 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'operator' | 'punctuation' | 'plain';
}

const KEYWORDS: Record<string, Set<string>> = {
  javascript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'switch', 'case', 'break', 'default', 'continue', 'do', 'yield', 'static', 'extends', 'super', 'get', 'set', 'of', 'in']),
  typescript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'string', 'number', 'boolean', 'any', 'void', 'never', 'unknown', 'readonly', 'private', 'public', 'protected', 'implements', 'extends', 'super', 'get', 'set', 'of', 'in', 'static', 'abstract', 'as', 'is', 'keyof', 'infer', 'typeof']),
  python: new Set(['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'pass', 'break', 'continue', 'yield', 'global', 'nonlocal', 'assert', 'del', 'async', 'await']),
  rust: new Set(['fn', 'let', 'mut', 'const', 'if', 'else', 'for', 'while', 'loop', 'match', 'return', 'struct', 'enum', 'impl', 'trait', 'use', 'mod', 'pub', 'self', 'true', 'false', 'Some', 'None', 'Ok', 'Err', 'where', 'type', 'static', 'ref', 'move', 'async', 'await', 'unsafe', 'extern', 'crate', 'super', 'dyn', 'box']),
  go: new Set(['package', 'import', 'func', 'return', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'break', 'continue', 'goto', 'fallthrough', 'defer', 'go', 'select', 'true', 'false', 'nil', 'error']),
  bash: new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'export', 'source', 'alias', 'unset', 'readonly', 'local', 'declare', 'echo', 'printf', 'read', 'true', 'false', 'test']),
  sql: new Set(['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'AS', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'VIEW', 'DATABASE', 'TRUNCATE', 'UNION', 'DISTINCT', 'ASC', 'DESC', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT', 'CHECK', 'UNIQUE']),
  json: new Set(['true', 'false', 'null']),
  yaml: new Set(['true', 'false', 'null', 'yes', 'no', 'on', 'off']),
};

const OPERATORS = new Set(['+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '++', '--', '+=', '-=', '*=', '/=', '=>', '->', '::', '?', ':', '??', '?.']);

function tokenize(code: string, language?: string): Token[] {
  const tokens: Token[] = [];
  const langKeywords = KEYWORDS[language?.toLowerCase() || ''] || KEYWORDS.javascript;
  
  let i = 0;
  const len = code.length;
  
  while (i < len) {
    const char = code[i];
    
    if (char === '/' && code[i + 1] === '/') {
      let end = code.indexOf('\n', i);
      if (end === -1) end = len;
      tokens.push({ text: code.slice(i, end), type: 'comment' });
      i = end;
      continue;
    }
    
    if (char === '#' && (language === 'python' || language === 'bash' || language === 'yaml')) {
      let end = code.indexOf('\n', i);
      if (end === -1) end = len;
      tokens.push({ text: code.slice(i, end), type: 'comment' });
      i = end;
      continue;
    }
    
    if (char === '"' || char === "'" || (char === '`' && (language === 'javascript' || language === 'typescript'))) {
      const quote = char;
      let j = i + 1;
      while (j < len) {
        if (code[j] === '\\' && j + 1 < len) {
          j += 2;
          continue;
        }
        if (code[j] === quote) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ text: code.slice(i, j), type: 'string' });
      i = j;
      continue;
    }
    
    if (/\d/.test(char) || (char === '-' && /\d/.test(code[i + 1]))) {
      let j = i + 1;
      while (j < len && /[\d.xXa-fA-F]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), type: 'number' });
      i = j;
      continue;
    }
    
    if (/[a-zA-Z_]/.test(char)) {
      let j = i + 1;
      while (j < len && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      
      if (langKeywords.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (code[j] === '(') {
        tokens.push({ text: word, type: 'function' });
      } else {
        tokens.push({ text: word, type: 'plain' });
      }
      i = j;
      continue;
    }
    
    if (OPERATORS.has(char) || OPERATORS.has(char + code[i + 1])) {
      const op = OPERATORS.has(char + code[i + 1]) ? char + code[i + 1] : char;
      tokens.push({ text: op, type: 'operator' });
      i += op.length;
      continue;
    }
    
    if (/[(){}\[\],;.]/.test(char)) {
      tokens.push({ text: char, type: 'punctuation' });
      i++;
      continue;
    }
    
    tokens.push({ text: char, type: 'plain' });
    i++;
  }
  
  return tokens;
}

export function CodeBlock({ code, language, showCopy = true }: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => tokenize(code, language), [code, language]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTokenColor = (type: Token['type']): string => {
    if (theme.dark) {
      switch (type) {
        case 'keyword': return '#C792EA';
        case 'string': return '#C3E88D';
        case 'number': return '#F78C6C';
        case 'comment': return '#546E7A';
        case 'function': return '#82AAFF';
        case 'operator': return '#89DDFF';
        case 'punctuation': return '#89DDFF';
        default: return '#EEFFFF';
      }
    } else {
      switch (type) {
        case 'keyword': return '#7C3AED';
        case 'string': return '#059669';
        case 'number': return '#D97706';
        case 'comment': return '#9CA3AF';
        case 'function': return '#2563EB';
        case 'operator': return '#DC2626';
        case 'punctuation': return '#6B7280';
        default: return '#1F2937';
      }
    }
  };

  const getLanguageColor = (lang?: string) => {
    const colors: Record<string, string> = {
      javascript: '#F7DF1E', typescript: '#3178C6', python: '#3776AB',
      rust: '#DEA584', go: '#00ADD8', java: '#ED8B00',
      bash: '#4EAA25', shell: '#4EAA25', json: '#292929',
      yaml: '#CB171E', html: '#E34F26', css: '#1572B6', sql: '#336791',
    };
    return lang ? colors[lang.toLowerCase()] || theme.colors.textSecondary : theme.colors.textSecondary;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginVertical: 8,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.dark ? '#1a1a2e' : '#e5e7eb',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    language: {
      fontSize: 12,
      color: getLanguageColor(language),
      fontWeight: '600',
      textTransform: 'lowercase',
    },
    copyButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: theme.dark ? '#2d2d44' : '#d1d5db',
    },
    copyText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    codeContainer: {
      padding: 12,
    },
    codeLine: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    token: {
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.language}>{language || 'code'}</Text>
        {showCopy && (
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.codeContainer}>
          <View style={styles.codeLine}>
            {tokens.map((token, index) => (
              <Text key={index} style={[styles.token, { color: getTokenColor(token.type) }]}>
                {token.text}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
