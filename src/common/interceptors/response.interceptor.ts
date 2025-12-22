import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

// Define the structure of the special response from your service
// This helps with type safety (though it's an 'any' map here).
interface GuestValidationResult {
  guest: any; // The guest object
  status: 'VALIDATED' | 'ALREADY_USED' | 'NOT_PAID'; // The status from the service
  message: string; // The user-facing message
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {

  // A simple type guard to check if the data matches your specific structure
  isGuestValidationResult(data: any): data is GuestValidationResult {
    return (
      data &&
      typeof data === 'object' &&
      data.status &&
      ['VALIDATED', 'ALREADY_USED', 'NOT_PAID'].includes(data.status)
    );
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        // 1. Check if the data is your special validation object
        if (this.isGuestValidationResult(data)) {
          // 2. Handle the special case:
          // Use the status and message from the service result directly.

          let success = true;
          // You might want to set success: false for ALREADY_USED or NOT_PAID,
          // depending on whether you consider those "successful" responses
          // from the API perspective (i.e., not an error, but not the desired outcome).
          // For a 200 OK response, setting success: true is common.
          // Let's use the reason for the specifics.

          return {
            success: true,
            reason: data.status,  // Use the service status (e.g., 'ALREADY_USED') as the reason
            data: data.guest,    // Only return the 'guest' object in the data field
            message: data.message,
          };
        }

        // 3. Handle the default case (any other successful response)
        // This is your original logic.
        return {
          success: true,
          reason: 'VALID', // Keep the default reason
          data: data,       // Return the original data
          message: 'Requête traitée avec succès',
        };
      }),
    );
  }
}