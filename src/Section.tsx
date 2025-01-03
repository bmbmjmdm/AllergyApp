
import React, { } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export function Section({children, title}: SectionProps): React.JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.sectionDescription}>
        {children}
      </View>
    </View>
  );
}

export function SectionText({children}:PropsWithChildren<{}>): React.JSX.Element {
  return <Text selectable style={styles.sectionText}>
    {children}
  </Text>
}


const styles = StyleSheet.create({
  sectionContainer: {
    margin: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: "#FFFFFF"
  },
  sectionDescription: {
    marginTop: 8,
    flexDirection: "column"
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '400',
    color: "#FFFFFF"
  },
});