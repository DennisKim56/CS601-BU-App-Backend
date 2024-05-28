const getGradebookById = (req, res, next) => {
  const gradebookId = req.params.gradebookId;
  console.log(gradebookId);
};

exports.getGradebookById = getGradebookById;
