﻿DROP PROCEDURE IF EXISTS dbo.FI_SP_VerificaCliente;
GO

CREATE PROC FI_SP_VerificaCliente
	@CPF VARCHAR(11)
AS
BEGIN
	SELECT CPF FROM CLIENTES WHERE CPF = @CPF
END