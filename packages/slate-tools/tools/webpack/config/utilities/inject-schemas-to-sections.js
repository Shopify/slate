const fs = require('fs');
const path = require('path');

module.exports = function(content, liquidFilePath) {

  let transformedContent = content.toString();

  // naming convention is : section_name.schema.json for separate json schema files.
  const jsonSchemaFilePath = liquidFilePath.replace('.liquid', '.schema.json');

  // to check if we already have defined {% schema %} in content
  const schemaTagExistsInFileRegex = /{%\s*schema\s*%}([\s\S]+){%\s*endschema\s*%}/gmi;
  // check for {% inject 'file.schema.json' %}
  const injectorRegex = /{%\s+inject\s+['"]([^'"]+)['"]\s*%}/gmi;
  const schemaTagExists = transformedContent.match(schemaTagExistsInFileRegex);

  // lets check if schema file exists and
  if (fs.existsSync(jsonSchemaFilePath)) {

    if (schemaTagExists) {
      // do nothing maybe warn about to inject it with {% inject 'file.json' %}
    } else {
      try {
        const jsonSchema = fs.readFileSync(jsonSchemaFilePath, 'utf8');

        console.log(
          `Found separate section schema for: ${liquidFilePath}`,
          `Injecting JSON Schema ${jsonSchemaFilePath}  to Section at ${liquidFilePath}`,
        );

        if (jsonSchema) {
          transformedContent =
`${transformedContent}
{% schema %}
  ${jsonSchema}
{% endschema %}
`;
        } else {
          console.warn(` No Schema defined for Section at: ${liquidFilePath}`);
        }
      } catch (exceptionObj) {
        console.warn(
          exceptionObj,
          ` Error reading  json schema file: ${jsonSchemaFilePath} for ${liquidFilePath}`,
        );
      }
    }
  }

  // lets inject all we want here :)
  if (transformedContent.match(injectorRegex)) {
    // lets check if injected file exists and inject it if needed
    let injectorMatch;

    while ((injectorMatch = injectorRegex.exec(transformedContent)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (injectorMatch.index === injectorRegex.lastIndex) {
        injectorRegex.lastIndex++;
      }
      // run over inject commands and inject files
      const injectorTagToReplace = injectorMatch[0];
      const injectedFileName = injectorMatch[1];

      if (injectorTagToReplace && injectedFileName) {
        const fileToInjectPath = path.resolve(path.dirname(liquidFilePath), injectedFileName);

        if (fs.existsSync(fileToInjectPath)) {
          const injectedFileContent = fs.readFileSync(fileToInjectPath, 'utf8');

          console.log(
            `Injecting ${fileToInjectPath} to ${liquidFilePath} at ${injectorTagToReplace}`,
          );
          transformedContent = transformedContent.replace(injectorTagToReplace, injectedFileContent);

        } else {
          console.warn(
            ` Inject command in ${liquidFilePath} can't find file to inject at ${fileToInjectPath}`,
          );
        }
      }
    }

  }


  // return content untouched if schema is already defined in it. or we don't have separate json file, or there's no {% inject 'filename' %}
  return transformedContent;

};
