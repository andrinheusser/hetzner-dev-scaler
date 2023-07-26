import { z } from "./../../deps.ts";

export const paginationSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  previous_page: z.number().nullable(),
  next_page: z.number().nullable(),
  last_page: z.number(),
  total_entries: z.number(),
});

export const metaSchema = z.object({
  pagination: paginationSchema,
});

export const locationSchema = z.object({
  city: z.string(),
  country: z.string(),
  description: z.string(),
  id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
  network_zone: z.string(),
});

export const datacenterServerTypeSchema = z.object({
  available: z.number().array(),
  available_for_migration: z.number().array(),
  supported: z.number().array(),
});

export const datacenterSchema = z.object({
  description: z.string(),
  id: z.number(),
  location: locationSchema,
  name: z.string(),
  server_types: datacenterServerTypeSchema,
});

export const imageSchema = z.object({
  architecture: z.enum(["x86", "arm"]),
  bound_to: z.number().nullable(),
  created: z.string().describe("ISO-8601"),
  created_from: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  deleted: z.string().nullable().describe("ISO-8601"),
  deprecated: z.string().nullable().describe("ISO-8601"),
  description: z.string(),
  disk_size: z.number().describe("GB"),
  id: z.number(),
  image_size: z.number().nullable().describe("GB"),
  labels: z.record(z.string()),
  name: z.string().nullable(),
  os_flavor: z.enum(["ubuntu", "centos", "debian", "fedora", "unknown"]),
  os_version: z.string().nullable(),
  protection: z.object({ delete: z.boolean() }),
  rapid_deploy: z.boolean(),
  status: z.enum(["available", "creating", "unavailable"]),
  type: z.enum(["system", "app", "snapshot", "backup", "temporary"]),
});

export const isoSchema = z.object({
  architecture: z.enum(["x86", "arm"]),
  deprecated: z.string().nullable().describe("ISO-8601"),
  description: z.string(),
  id: z.number(),
  name: z.string().nullable(),
  type: z.enum(["public", "private"]),
});

export const placementGroupSchema = z.object({
  created: z.string().describe("ISO-8601"),
  id: z.number(),
  labels: z.record(z.string()),
  name: z.string(),
  servers: z.number().array(),
  type: z.enum(["spread"]),
});

export const firewallSchema = z.object({
  id: z.number(),
  status: z.enum(["applied", "pending"]),
});

export const publicNetSchema = z.object({
  firewalls: firewallSchema.array(),
  floating_ips: z.number().array(),
  ipv4: z.object({
    blocked: z.boolean(),
    dns_ptr: z.string().nullable(),
    id: z.number(),
    ip: z.string(),
  }).nullable(),
  ipv6: z.object({
    blocked: z.boolean(),
    dns_ptr: z.object({
      dns_ptr: z.string(),
      ip: z.string(),
    }).array().nullable(),
    id: z.number(),
    ip: z.string(),
  }).nullable(),
});

export const priceSchema = z.object({
  gross: z.string(),
  net: z.string(),
});

export const priceLocationSchema = z.object({
  location: z.string(),
  price_hourly: priceSchema,
  price_monthly: priceSchema,
});

export const serverTypeSchema = z.object({
  cores: z.number(),
  cpu_type: z.enum(["shared", "dedicated"]),
  deprecated: z.boolean(),
  description: z.string(),
  disk: z.number().describe("GB"),
  id: z.number(),
  memory: z.number().describe("GB"),
  name: z.string(),
  prices: priceLocationSchema.array(),
  storage_type: z.enum(["local", "network"]),
});

export const serverSchema = z.object({
  backup_window: z.string().nullable(),
  created: z.string(),
  datacenter: datacenterSchema,
  id: z.number(),
  image: imageSchema,
  included_traffic: z.number().describe("bytes"),
  ingoing_traffic: z.number().nullable().describe("bytes"),
  iso: isoSchema.nullable(),
  labels: z.record(z.string()),
  load_balancers: z.array(z.number()),
  locked: z.boolean(),
  name: z.string(),
  outgoing_traffic: z.number().nullable().describe("bytes"),
  placement_group: placementGroupSchema.nullable(),
  primary_disk_size: z.number().describe("GB"),
  private_net: z.object({
    alias_ips: z.string().array(),
    ip: z.string(),
    mac_address: z.string(),
    network: z.number(),
  }).array(),
  protection: z.object({
    delete: z.boolean(),
    rebuild: z.boolean(),
  }),
  public_net: publicNetSchema,
  rescue_enabled: z.boolean(),
  server_type: serverTypeSchema,
  status: z.enum([
    "running",
    "initializing",
    "starting",
    "stopping",
    "off",
    "deleting",
    "migrating",
    "rebuilding",
    "unknown",
    "undefined",
  ]).optional(),
  volumes: z.number().array().optional(),
});

export const actionSchema = z.object({
  command: z.string(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }).nullable(),
  finished: z.string().nullable().describe("ISO-8601"),
  id: z.number(),
  progress: z.number(),
  resources: z.object({
    id: z.number(),
    type: z.string(),
  }).array(),
  started: z.string().describe("ISO-8601"),
  status: z.enum(["success", "running", "error"]),
});
