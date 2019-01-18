const fs = require('fs');

module.exports = function(content, path) {

    // naming convention is : section_name.schema.json for separate json schema files.
    const jsonShemaFilePath = path.replace('.liquid','.schema.json');

    // lets check if shema file exists and 

    if(fs.existsSync(jsonShemaFilePath)){
    
        console.log(`Found separate section schema for: ${path}`);

        content = content.toString();

        // and check if we already have defined {% schema %} in content
        if(!content.match(/{\%\s*schema\s*\%}([\s\S]+){\%\s*endschema\s*\%}/gmi)){

            try{
            const jsonSchema = fs.readFileSync(jsonShemaFilePath, 'utf8');
                            
            console.log(`Injecting JSON Shema ${jsonShemaFilePath}  to Section at ${path}`);
    
                if(jsonSchema){
                    content = 
`${content}
{% schema %}
  ${jsonSchema}
{% endschema %}
`;
                }else{
                    console.warn(` No Schema defined for Section at: ${path}`);  
                }
            }catch(e){
                console.warn(e,` Error reading  json shema file: ${jsonShemaFilePath} for ${path}`);
            }
      }else{
        console.warn(`!----------------------------------------------------------! `);
        console.warn(` You have json shema file: ${jsonShemaFilePath} for ${path} `);
        console.warn(` but it contains {% schema %}...{% endschema %} declaration`);
        console.warn(` please remove it from ${path} `);
        console.warn(` to allow me to inject schema from separate .schema.json file `);
        console.warn(`------------------------------------------------------------ `);
      }
    }
    // return content untouched if schema is already defined in it. or we don't have separate json file
    return content;

}
