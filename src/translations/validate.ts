import arTranslations from './ar';
import enTranslations from './en';

interface ValidationError {
  path: string;
  message: string;
}

type TranslationValue = string | { [key: string]: TranslationValue };

const validateTranslations = (
  obj1: Record<string, TranslationValue>,
  obj2: Record<string, TranslationValue>,
  path: string = '',
  errors: ValidationError[] = []
): ValidationError[] => {
  // Get all keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check for missing keys in obj2
  for (const key of keys1) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj2)) {
      errors.push({
        path: currentPath,
        message: `Missing key in second object: ${currentPath}`,
      });
    } else if (
      typeof obj1[key] === 'object' &&
      obj1[key] !== null &&
      typeof obj2[key] === 'object' &&
      obj2[key] !== null
    ) {
      // Recursively validate nested objects
      validateTranslations(
        obj1[key] as Record<string, TranslationValue>,
        obj2[key] as Record<string, TranslationValue>,
        currentPath,
        errors
      );
    }
  }

  // Check for missing keys in obj1
  for (const key of keys2) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj1)) {
      errors.push({
        path: currentPath,
        message: `Missing key in first object: ${currentPath}`,
      });
    }
  }

  return errors;
};

const validateTranslationFiles = (): void => {
  console.log('\n🔍 Validating translation files...\n');

  const errors = validateTranslations(enTranslations, arTranslations);

  if (errors.length > 0) {
    console.error('\n❌ Translation validation failed!\n');
    console.error('Found the following issues:\n');

    // Group errors by type
    const missingInSecond = errors.filter((e) => e.message.includes('second object'));
    const missingInFirst = errors.filter((e) => e.message.includes('first object'));

    if (missingInSecond.length > 0) {
      console.error('Missing in Arabic translations:');
      missingInSecond.forEach((error) => {
        console.error(`  • ${error.path}`);
      });
      console.error('');
    }

    if (missingInFirst.length > 0) {
      console.error('Missing in English translations:');
      missingInFirst.forEach((error) => {
        console.error(`  • ${error.path}`);
      });
      console.error('');
    }

    console.error('Please ensure all translation keys are present in both files.\n');
    process.exit(1);
  }

  console.log('✅ Translation files are valid!\n');
};

// Run validation if this file is executed directly
if (require.main === module) {
  validateTranslationFiles();
}

export { validateTranslationFiles };
