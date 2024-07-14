using FI.AtividadeEntrevista.BLL;
using FI.WebAtividadeEntrevista.Utilities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FI.WebAtividadeEntrevista.Validations
{
    public class CPFAttribute : ValidationAttribute, IValidatableObject
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            Functions functions = new Functions();
            BoCliente boCliente = new BoCliente();
            var cpf = value as string;
            cpf = functions.TratarCPF(cpf);

            if (!functions.ValidarCPF(cpf))
            {
                return new ValidationResult("CPF inválido.");
            }

            if (boCliente.VerificarExistencia(cpf))
            {
                return new ValidationResult("Este CPF já está cadastrado.");
            }
            return ValidationResult.Success;
        }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            throw new System.NotImplementedException();
        }
    }
}