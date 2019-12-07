export const findErrors = (res, errorMessage) => {
  if (res.status !== 200) throw new Error(errorMessage);
};

export const findErrorsExtended = (res, errorMessage) => {
  if (res.status !== 200 && res.status !== 201) throw new Error(errorMessage);
};

export const findValidationErrors = res => {
  if (res.status !== 200) throw new Error("Validation failed.");
};
