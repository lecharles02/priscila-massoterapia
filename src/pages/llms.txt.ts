import type { APIRoute } from "astro";
import { site as business } from "../data/site";
import { services } from "../data/services";
import { articles } from "../data/articles";
export const GET: APIRoute = ({site}) => {
 const base=site || new URL("https://priscilamassagemsp.com.br");
 const link=(path:string)=>new URL(path,base).href;
 const content=["# Priscila Massoterapia","> Massoterapeuta tântrica em Campinas, especialista em Nuru. Atendimento individual para homens, com reserva de horário.","## Informações confirmadas",...[
 "Regiões: Cambuí e Nova Campinas, Campinas, SP.","Espaço particular com garagem. O endereço completo é informado somente pelo WhatsApp, por segurança.",business.hours.weekday+". "+business.hours.saturday+".","Contato: "+business.phone,"Valores, duração e disponibilidade: consultar diretamente pelo WhatsApp."].map(text=>"- "+text),"## Páginas principais",...[["Sobre Priscila","/sobre-priscila/"],["Massagens","/especialidades/"],["Contato e horários","/contato/"],["Blog","/blog/"]].map(([name,path])=>"- ["+name+"]("+link(path)+")"),"## Modalidades",...services.map(service=>"- ["+service.name+"]("+link("/especialidades/"+service.slug+"/")+"): "+service.summary),"## Orientações",...articles.map(article=>"- ["+article.title+"]("+link("/"+article.slug+"/")+"): "+article.description),"## Agendamento","- [WhatsApp]("+business.whatsapp+")","- [Perfil do Google]("+business.googleProfileUrl+")"].join("\n\n");
 return new Response(content+"\n",{headers:{"Content-Type":"text/plain; charset=utf-8"}});
};
