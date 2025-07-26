import {
  integer,
  pgTable,
  varchar,
  serial,
  timestamp,
  boolean,
  text,
  date,
  time,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const rolesTable = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(), // admin, dispatcher, viewer
});

export const userRolesTable = pgTable("user_roles", {
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
  role_id: integer()
    .notNull()
    .references(() => rolesTable.id),
});

export const driversTable = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  license_number: varchar({ length: 100 }).notNull().unique(),
  available: boolean().notNull(),
});

export const busesTable = pgTable("buses", {
  id: serial("id").primaryKey(),
  plate_number: varchar({ length: 50 }).notNull().unique(),
  capacity: integer().notNull(),
});

export const routesTable = pgTable("routes", {
  id: serial("id").primaryKey(),
  origin: varchar({ length: 255 }).notNull(),
  destination: varchar({ length: 255 }).notNull(),
  estimated_duration_minutes: integer().notNull(),
});

export const shiftsTable = pgTable("shifts", {
  id: serial("id").primaryKey(),
  driver_id: integer()
    .notNull()
    .references(() => driversTable.id),
  bus_id: integer()
    .notNull()
    .references(() => busesTable.id),
  route_id: integer()
    .notNull()
    .references(() => routesTable.id),
  shift_date: date().notNull(),
  shift_time: time().notNull(),
});
