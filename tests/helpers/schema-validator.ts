import { expect } from '@playwright/test';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import path from 'path';

const ajv = new Ajv({
  allErrors: true,
  strict: false
});

addFormats(ajv);

const schemaCache = new Map<string, object>();

function loadSchema(schemaRelativePath: string): object {
  if (schemaCache.has(schemaRelativePath)) {
    return schemaCache.get(schemaRelativePath)!;
  }

  const schemaPath = path.resolve(process.cwd(), schemaRelativePath);

  const schemaContent = readFileSync(schemaPath, 'utf-8')
    .replace(/^\uFEFF/, '')
    .trim();

  const schema = JSON.parse(schemaContent);

  schemaCache.set(schemaRelativePath, schema);

  return schema;
}

function formatAjvError(error: ErrorObject): string {
  const path = error.instancePath || '/';

  return `${path} ${error.message}`;
}

export function validateSchema(data: unknown, schemaRelativePath: string) {
  const schema = loadSchema(schemaRelativePath);
  const validate = ajv.compile(schema);

  const isValid = validate(data);

  const errors =
    validate.errors?.map(formatAjvError).join('\n') ??
    'Nenhum detalhe de erro disponível';

  expect(
    isValid,
    `Falha na validação do schema: ${schemaRelativePath}\n${errors}`
  ).toBeTruthy();
}