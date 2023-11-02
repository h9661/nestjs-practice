import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length == 1) {
    return `${args.property} must be longer than ${args.constraints[0]} characters`;
  } else {
    return `${args.property} must be longer than ${args.constraints[0]} and shorter than ${args.constraints[1]} characters`;
  }
};
