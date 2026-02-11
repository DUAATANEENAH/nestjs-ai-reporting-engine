import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
	Paramtype,
} from '@nestjs/common';
import * as Joi from 'joi';
import * as _ from 'lodash';

/*
- A pipe is a class operate on the arguments being processed by a controller route handler.
- Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method.
- the class use Joi validation module to validate data at the request level.
How To use it:
-import the class in Controllers
-import UsePipes from  '@nestjs/common'
-put '@UsePipes()' under HTTP Methods.
- create a new instance and pass the schema 'new ValidationPipe(schema)'.
*/

@Injectable()
export class ValidationPipe implements PipeTransform {
	private paramType: Paramtype;

	constructor(private readonly schema: object, paramType: Paramtype = null) {
		this.paramType = paramType;
	}

	transform(rawValue: JSON, metadata: ArgumentMetadata) {
		if (this.paramType && this.paramType !== metadata.type) {
			return rawValue;
		}

		const { error } = Joi.object(this.schema).validate(rawValue);

		if (error) {
			const firstError = _.first(error.details);
			throw new BadRequestException(
				(firstError && firstError.message) || 'Validation failed',
			);
		}

		return rawValue;
	}
}
