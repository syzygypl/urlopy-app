const TYPES = {
  POSTMARK: 'PostmarkError',
  DATABASE: 'DatabaseError',
};

class CustomErrorBase extends Error {
  constructor(message, original) {
    super(message);
    this.originalError = original;
  }
  extend(data) {
    const original = this.originalError;
    let extendObject = data;

    if (Object.values(TYPES).indexOf(original.name) !== -1) {
      extendObject = original;
      this.message = original.message;
    }

    Object.keys(extendObject).forEach((key) => {
      if (Object.hasOwnProperty.call(extendObject, key)) {
        this[key] = extendObject[key];
      }
    });
  }
}

class PostmarkError extends CustomErrorBase {
  constructor(message, code, original) {
    super(message, original);
    super.extend({
      code: `POSTMARK-${code}`,
      name: TYPES.POSTMARK,
    });
  }
}

class DatabaseError extends CustomErrorBase {
  constructor(message, code, original) {
    super(message, original);
    super.extend({
      code: `DB-${code}`,
      name: TYPES.DATABASE,
    });
  }
}

module.exports = {
  PostmarkError,
  DatabaseError,
};
