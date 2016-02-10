// var fs = require('fs');
// var path = require('path');
//
// var buf = new Buffer(
//     'package main\n\nimport (\n\t"bytes"\n\t"log"\n\t"net/smtp"\n\t"strconv"\n\t"text/template"\n)\n\ntype EmailUser struct {\n\tUsername    string\n\tPassword    string\n\tEmailServer string\n\tPort        int\n}\n\ntype SMTPTemplateData struct {\n\tFrom    string\n\tTo      string\n\tSubject string\n\tBody    string\n}\n\nconst emailTemplate = `From: &#123;&#123;.From&#125;&#125;\nTo: &#123;&#123;.To&#125;&#125;\nSubject: &#123;&#123;.Subject&#125;&#125;\n\n&#123;&#123;.Body&#125;&#125;\n\nSincerely,\n\n&#123;&#123;.From&#125;&#125;\n`\n\nvar err error\nvar doc bytes.Buffer\n\nfunc main() {\n\n\temailUser := &EmailUser{"pernhultmattias@gmail.com", "isa1992mitzi", "smtp.gmail.com", 587}\n\n\tauth := smtp.PlainAuth(\n\t\t"",\n\t\temailUser.Username,\n\t\temailUser.Password,\n\t\temailUser.EmailServer,\n\t)\n\n\tcontext := &SMTPTemplateData{\n\t\t"SmtpEmailSender",\n\t\t"recipient@domain.com",\n\t\t"This is the e-mail subject line!",\n\t\t"Hello, this is a test e-mail body.",\n\t}\n\tt := template.New("emailTemplate")\n\tt, err = t.Parse(emailTemplate)\n\tif err != nil {\n\t\tlog.Print("error trying to parse mail template")\n\t}\n\terr = t.Execute(&doc, context)\n\tif err != nil {\n\t\tlog.Print("error trying to execute mail template")\n\t}\n\n\terr = smtp.SendMail(\n\t\temailUser.EmailServer+":"+strconv.Itoa(emailUser.Port),\n\t\tauth,\n\t\temailUser.Username,\n\t\t[]string{"alhbinfelix@gmail.com"},\n\t\tdoc.Bytes())\n\n\tif err != nil {\n\t\tlog.Print("ERROR: attempting to send a mail ", err)\n\t}\n\n\t// err := smtp.SendMail(\n\t// \t"smtp.gmail.com:587",\n\t// \tauth,\n\t// \temailUser.Username,\n\t// \t[]string{"alhbinfelix@gmail.com"},\n\t// \t[]byte("Hello, Jag tror Musse skulle vilja vara här"),\n\t// )\n\t//\n\t// if err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n\n\t//\n\t// c, err := smtp.Dial("smtp.gmail.com:587")\n\t//\n\t// if err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n\t//\n\t// defer c.Close()\n\t//\n\t// // Set the sender and recipient\n\t// c.Mail("pernhultmattias@gmail.com")\n\t// c.Rcpt("alhbinfelix@gmail.com")\n\t//\n\t// // email body\n\t// wc, err := c.Data()\n\t// if err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n\n\t// defer wc.Close()\n\t//\n\t// buf := bytes.NewBufferString("Hello Felix, Jag tror Musse hade velat vara här")\n\t// if _, err := buf.WriteTo(wc); err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n}\n',
//     'utf-8'
// );
//
// var buf2 = new Buffer(100000);
//
// var len = buf2.write('package main\n\nimport (\n\t"bytes"\n\t"log"\n\t"net/smtp"\n\t"strconv"\n\t"text/template"\n)\n\ntype EmailUser struct {\n\tUsername    string\n\tPassword    string\n\tEmailServer string\n\tPort        int\n}\n\ntype SMTPTemplateData struct {\n\tFrom    string\n\tTo      string\n\tSubject string\n\tBody    string\n}\n\nconst emailTemplate = `From: &#123;&#123;.From&#125;&#125;\nTo: &#123;&#123;.To&#125;&#125;\nSubject: &#123;&#123;.Subject&#125;&#125;\n\n&#123;&#123;.Body&#125;&#125;\n\nSincerely,\n\n&#123;&#123;.From&#125;&#125;\n`\n\nvar err error\nvar doc bytes.Buffer\n\nfunc main() {\n\n\temailUser := &EmailUser{"pernhultmattias@gmail.com", "isa1992mitzi", "smtp.gmail.com", 587}\n\n\tauth := smtp.PlainAuth(\n\t\t"",\n\t\temailUser.Username,\n\t\temailUser.Password,\n\t\temailUser.EmailServer,\n\t)\n\n\tcontext := &SMTPTemplateData{\n\t\t"SmtpEmailSender",\n\t\t"recipient@domain.com",\n\t\t"This is the e-mail subject line!",\n\t\t"Hello, this is a test e-mail body.",\n\t}\n\tt := template.New("emailTemplate")\n\tt, err = t.Parse(emailTemplate)\n\tif err != nil {\n\t\tlog.Print("error trying to parse mail template")\n\t}\n\terr = t.Execute(&doc, context)\n\tif err != nil {\n\t\tlog.Print("error trying to execute mail template")\n\t}\n\n\terr = smtp.SendMail(\n\t\temailUser.EmailServer+":"+strconv.Itoa(emailUser.Port),\n\t\tauth,\n\t\temailUser.Username,\n\t\t[]string{"alhbinfelix@gmail.com"},\n\t\tdoc.Bytes())\n\n\tif err != nil {\n\t\tlog.Print("ERROR: attempting to send a mail ", err)\n\t}\n\n\t// err := smtp.SendMail(\n\t// \t"smtp.gmail.com:587",\n\t// \tauth,\n\t// \temailUser.Username,\n\t// \t[]string{"alhbinfelix@gmail.com"},\n\t// \t[]byte("Hello, Jag tror Musse skulle vilja vara här"),\n\t// )\n\t//\n\t// if err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n\n\t//\n\t// c, err := smtp.Dial("smtp.gmail.com:587")\n\t//\n\t// if err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n\t//\n\t// defer c.Close()\n\t//\n\t// // Set the sender and recipient\n\t// c.Mail("pernhultmattias@gmail.com")\n\t// c.Rcpt("alhbinfelix@gmail.com")\n\t//\n\t// // email body\n\t// wc, err := c.Data()\n\t// if err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n\n\t// defer wc.Close()\n\t//\n\t// buf := bytes.NewBufferString("Hello Felix, Jag tror Musse hade velat vara här")\n\t// if _, err := buf.WriteTo(wc); err != nil {\n\t// \tlog.Fatal(err)\n\t// }\n}\n');
//
// // console.log(buf2);
//
// fs.writeFile(path.join(__dirname, './test.go'), buf, function(err) {
//     console.log(err);
// });
//
// // console.log(buf.toString("utf-8"));


var fs   = require('fs'),
    file = process.argv[2];
    console.log(file);
    data = fs.readFileSync(file);


var jh = data.toString('base64');
console.log(jh);

console.log(new Buffer(jh.toString(), 'base64').toString('ascii'));
