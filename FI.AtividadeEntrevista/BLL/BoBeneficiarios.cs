using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DAL.Beneficiarios;
using FI.AtividadeEntrevista.DML;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiarios
    {
        public void Incluir(string beneficiario, long idCliente)
        {
            if(!string.IsNullOrEmpty(beneficiario))
            {
                DaoBeneficiario db = new DaoBeneficiario();
                foreach(Beneficiario item in DeserializeJsonBeneficiarios(beneficiario))
                {
                    db.Incluir(item, idCliente);
                }
            }
        }

        public List<Beneficiario> Consultar(long id)
        {
            DaoBeneficiario beneficiario = new DaoBeneficiario();
            return beneficiario.Consultar(id);
        }

        private List<Beneficiario> DeserializeJsonBeneficiarios(string jsonBeneficiarios)
        {

            List<Beneficiario> beneficiarios = new List<Beneficiario>();
            jsonBeneficiarios = jsonBeneficiarios.Trim('"');
            jsonBeneficiarios = jsonBeneficiarios.Replace("\\\"", "\"");
            jsonBeneficiarios = jsonBeneficiarios.Trim('[', ']');
            string[] objetos = jsonBeneficiarios.Split(new string[] { "},{" }, StringSplitOptions.None);

            foreach (string objeto in objetos)
            {
                Beneficiario beneficiario = new Beneficiario();
                string objSemChaves = objeto.Trim('{', '}');
                string[] pares = objSemChaves.Split(',');

                foreach (string par in pares)
                {
                    string[] chaveValor = par.Split(':');

                    string chave = chaveValor[0].Trim('"').ToLower();
                    string valor = chaveValor[1].Trim('"');

                    switch (chave)
                    {
                        case "id":
                            beneficiario.Id = int.Parse(valor);
                            break;
                        case "nome":
                            beneficiario.Nome = valor;
                            break;
                        case "cpf":
                            beneficiario.CPF = valor;
                            break;
                    }
                }

                beneficiarios.Add(beneficiario);
            }

            return beneficiarios;
        }
    }
}
