export const CONSTANT = {
  credentialsKey: 'Chrome_moralMind_credentials',
}

export const ERROR_OBJECTS: Object = {
  required: '{{field}} is required',
  email: 'Please enter a valid email',
  notEquivalent: 'New password and confirm password does not match.',
  min: 'Please enter value more than {{value}}',
  max: 'Please enter value not more than {{value}}',
  minlength: 'Please enter value with min length {{value}}',
  maxlength: 'Please enter value with max length {{value}}',
  pattern: 'Please enter valid value',
  totalHundred: 'The sum of Advance, Withhold, PR Fee must be equals to 100%',
  totalPrice: 'The sum of the split amounts must be equal to the price.',
  // website: 'Please enter a valid website URL',
  website: 'Website must be a valid URL including protocol identifier (i.e., http:// or https://)',
  ccNumber: 'Please enter valid card number',
  notZero: 'Please enter value greater than 0',
  dateDiff: 'Please select correct date range',
  timeDiff: 'Please select correct time range',
  timeLimit: 'Please select time range of 30 mins',
  validPassword: 'Password must contain 8 characters min, 1 upper, 1 number and 1 special character',
  zipCode: 'Please enter a valid 5-digit zip code',
  taxIdError: 'Tax ID must be a numeric value',
  customUsername: 'Only numbers and characters allowed',
  onlyNumber: '{{value}} must be a numeric value'
};
