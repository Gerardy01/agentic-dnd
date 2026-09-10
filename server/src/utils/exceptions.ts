export class ExistData extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExistDataError';
  }
}

export class DataNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataNotFoundError';
  }
}

export class WrongFormat extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongFormatError';
  }
}

export class NotValid extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotValidError';
  }
}

export class Forbidden extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}
