// Map of slug -> SVG path data extracted from simple-icons at build time.
// Tree-shaken: only the icons imported here end up in the bundle.

import ansible from "simple-icons/icons/ansible.svg?raw";
import apachesuperset from "simple-icons/icons/apachesuperset.svg?raw";
import asterisk from "simple-icons/icons/asterisk.svg?raw";
import authentik from "simple-icons/icons/authentik.svg?raw";
import bluesky from "simple-icons/icons/bluesky.svg?raw";
import calibreweb from "simple-icons/icons/calibreweb.svg?raw";
import docker from "simple-icons/icons/docker.svg?raw";
import erpnext from "simple-icons/icons/erpnext.svg?raw";
import gitea from "simple-icons/icons/gitea.svg?raw";
import gitlab from "simple-icons/icons/gitlab.svg?raw";
import grafana from "simple-icons/icons/grafana.svg?raw";
import homeassistant from "simple-icons/icons/homeassistant.svg?raw";
import jellyfin from "simple-icons/icons/jellyfin.svg?raw";
import kiwix from "simple-icons/icons/kiwix.svg?raw";
import mariadb from "simple-icons/icons/mariadb.svg?raw";
import metabase from "simple-icons/icons/metabase.svg?raw";
import n8n from "simple-icons/icons/n8n.svg?raw";
import nextcloud from "simple-icons/icons/nextcloud.svg?raw";
import ollama from "simple-icons/icons/ollama.svg?raw";
import outline from "simple-icons/icons/outline.svg?raw";
import paperlessngx from "simple-icons/icons/paperlessngx.svg?raw";
import portainer from "simple-icons/icons/portainer.svg?raw";
import postgresql from "simple-icons/icons/postgresql.svg?raw";
import prometheus from "simple-icons/icons/prometheus.svg?raw";
import qgis from "simple-icons/icons/qgis.svg?raw";
import redis from "simple-icons/icons/redis.svg?raw";
import rustfs from "simple-icons/icons/rustfs.svg?raw";
import traefikproxy from "simple-icons/icons/traefikproxy.svg?raw";
import uptimekuma from "simple-icons/icons/uptimekuma.svg?raw";
import vaultwarden from "simple-icons/icons/vaultwarden.svg?raw";
import wordpress from "simple-icons/icons/wordpress.svg?raw";

const RAW: Record<string, string> = {
  ansible,
  apachesuperset,
  asterisk,
  authentik,
  bluesky,
  calibreweb,
  docker,
  erpnext,
  gitea,
  gitlab,
  grafana,
  homeassistant,
  jellyfin,
  kiwix,
  mariadb,
  metabase,
  n8n,
  nextcloud,
  ollama,
  outline,
  paperlessngx,
  portainer,
  postgresql,
  prometheus,
  qgis,
  redis,
  rustfs,
  traefikproxy,
  uptimekuma,
  vaultwarden,
  wordpress,
};

function extractPath(svg: string): string {
  // simple-icons use a single <path d="..."> per file.
  const match = svg.match(/<path d="([^"]+)"/);
  return match ? match[1] : "";
}

export const BRAND_PATHS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW).map(([slug, svg]) => [slug, extractPath(svg)]),
);

export function getBrandPath(slug?: string): string | null {
  if (!slug) return null;
  return BRAND_PATHS[slug] ?? null;
}
