import * as handlebars from 'handlebars';
import * as fs from 'fs';

class HtmlService {
  create(templatePath: string, variables: object) {
    const templateFileContent = fs.readFileSync(templatePath).toString('utf8');
    const mailTemplateParse = handlebars.compile(templateFileContent);

    return mailTemplateParse(variables);
  }
}

export { HtmlService };
