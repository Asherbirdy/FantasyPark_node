const CustomError = require('../errors');

/*
檢查 JSON 檔案 是否 有所需要的屬性
例如：  validateObjectsRequiredProperties(req.body, ['ticketDate','ticketId', 'amount', ]);

*/
function validateObjectsRequiredProperties(arr, requiredProperties) {
  const hasAllRequiredProperties = arr.every((item) =>
    requiredProperties.every((prop) => item.hasOwnProperty(prop))
  );

  if (!hasAllRequiredProperties) {
    throw new CustomError.BadRequestError(
      `每筆物件屬性名必須要有 ${requiredProperties}"`
    );
  }
}

module.exports = { validateObjectsRequiredProperties };
