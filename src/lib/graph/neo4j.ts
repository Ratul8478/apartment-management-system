import { env } from '../config/env';

/**
 * FinTrack Pro — Neo4j AuraDB Graph Database Client Helper
 * 
 * Provides financial entity graph relationships and Cypher query interface.
 */

export interface Neo4jConfig {
  uri: string;
  username: string;
  password?: string;
}

export function getNeo4jConfig(): Neo4jConfig {
  return {
    uri: process.env.NEO4J_URI || env.NEO4J_URI || 'neo4j+s://demo.databases.neo4j.io',
    username: process.env.NEO4J_USERNAME || env.NEO4J_USERNAME || 'neo4j',
    password: process.env.NEO4J_PASSWORD || env.NEO4J_PASSWORD || '',
  };
}

export function isNeo4jConfigured(): boolean {
  const config = getNeo4jConfig();
  return Boolean(config.uri && config.username && config.password);
}
