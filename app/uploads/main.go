package main

import (
	"bytes"
	"log"
	"net/smtp"
	"strconv"
	"text/template"
)

type EmailUser struct {
	Username    string
	Password    string
	EmailServer string
	Port        int
}

type SMTPTemplateData struct {
	From    string
	To      string
	Subject string
	Body    string
}

const emailTemplate = `From: &#123;&#123;.From&#125;&#125;
To: &#123;&#123;.To&#125;&#125;
Subject: &#123;&#123;.Subject&#125;&#125;

&#123;&#123;.Body&#125;&#125;

Sincerely,

&#123;&#123;.From&#125;&#125;
`

var err error
var doc bytes.Buffer

func main() {

	emailUser := &EmailUser{"pernhultmattias@gmail.com", "isa1992mitzi", "smtp.gmail.com", 587}

	auth := smtp.PlainAuth(
		"",
		emailUser.Username,
		emailUser.Password,
		emailUser.EmailServer,
	)

	context := &SMTPTemplateData{
		"SmtpEmailSender",
		"recipient@domain.com",
		"This is the e-mail subject line!",
		"Hello, this is a test e-mail body.",
	}
	t := template.New("emailTemplate")
	t, err = t.Parse(emailTemplate)
	if err != nil {
		log.Print("error trying to parse mail template")
	}
	err = t.Execute(&doc, context)
	if err != nil {
		log.Print("error trying to execute mail template")
	}

	err = smtp.SendMail(
		emailUser.EmailServer+":"+strconv.Itoa(emailUser.Port),
		auth,
		emailUser.Username,
		[]string{"alhbinfelix@gmail.com"},
		doc.Bytes())

	if err != nil {
		log.Print("ERROR: attempting to send a mail ", err)
	}

	// err := smtp.SendMail(
	// 	"smtp.gmail.com:587",
	// 	auth,
	// 	emailUser.Username,
	// 	[]string{"alhbinfelix@gmail.com"},
	// 	[]byte("Hello, Jag tror Musse skulle vilja vara här"),
	// )
	//
	// if err != nil {
	// 	log.Fatal(err)
	// }

	//
	// c, err := smtp.Dial("smtp.gmail.com:587")
	//
	// if err != nil {
	// 	log.Fatal(err)
	// }
	//
	// defer c.Close()
	//
	// // Set the sender and recipient
	// c.Mail("pernhultmattias@gmail.com")
	// c.Rcpt("alhbinfelix@gmail.com")
	//
	// // email body
	// wc, err := c.Data()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// defer wc.Close()
	//
	// buf := bytes.NewBufferString("Hello Felix, Jag tror Musse hade velat vara här")
	// if _, err := buf.WriteTo(wc); err != nil {
	// 	log.Fatal(err)
	// }
}
