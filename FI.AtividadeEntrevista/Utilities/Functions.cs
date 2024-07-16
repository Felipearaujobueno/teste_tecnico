﻿using System.Linq;
using System.Text.RegularExpressions;

namespace FI.WebAtividadeEntrevista.Utilities
{
    public class Functions
    {
        public string TratarCPF(string cpf)
        {
            string str = new string(cpf.Where(char.IsDigit).ToArray());
            return str;
        }

        public bool ValidarCPF(string cpf)
        {
            cpf = Regex.Replace(cpf, @"[^\d]", "");

            if (cpf.Length != 11)
                return false;

            int[] multiplicadoresPrimeiroDigito = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicadoresSegundoDigito = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCpf = cpf.Substring(0, 9);
            int soma = 0;

            for (int i = 0; i < 9; i++)
            {
                soma += int.Parse(tempCpf[i].ToString()) * multiplicadoresPrimeiroDigito[i];
            }

            int resto = soma % 11;
            int digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

            tempCpf += digitoVerificador1;
            soma = 0;

            for (int i = 0; i < 10; i++)
            {
                soma += int.Parse(tempCpf[i].ToString()) * multiplicadoresSegundoDigito[i];
            }

            resto = soma % 11;
            int digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

            return cpf.EndsWith(digitoVerificador1.ToString() + digitoVerificador2.ToString());
        }
    }
}