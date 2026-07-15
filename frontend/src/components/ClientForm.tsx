import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import type { ColorOption } from "../types";
import { ApiError, createClient } from "../api";
import {
  buildClientSchema,
  formatCpf,
  type ClientFormValues,
} from "../validation";

interface Props {
  colors: ColorOption[];
  onSuccess: () => void;
}

export function ClientForm({ colors, onSuccess }: Props) {
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(
    () => buildClientSchema(colors.map((c) => c.value)),
    [colors],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { favoriteColor: "" },
  });

  // Registro do CPF reaproveitado no input para adicionar a máscara sem perder
  // a integração com o React Hook Form.
  const cpfField = register("cpf");

  async function onSubmit(values: ClientFormValues) {
    setFormError(null);
    try {
      await createClient(values);
      onSuccess();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        // Reaproveita os erros por campo vindos da API (ex.: CPF já cadastrado)
        // e os associa ao campo correspondente no formulário.
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          setError(field as keyof ClientFormValues, {
            message: messages[0],
          });
        }
        return;
      }
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o cadastro.",
      );
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && (
        <p className="alert alert--error" role="alert">
          {formError}
        </p>
      )}

      <div className="field">
        <label htmlFor="fullName">Nome completo</label>
        <input id="fullName" type="text" {...register("fullName")} />
        {errors.fullName && <span className="error">{errors.fullName.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="cpf">CPF</label>
        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          placeholder="000.000.000-00"
          maxLength={14}
          {...cpfField}
          onChange={(event) => {
            // Aplica a máscara enquanto digita; o valor formatado segue para o
            // React Hook Form. O backend recebe e salva apenas os dígitos.
            event.target.value = formatCpf(event.target.value);
            cpfField.onChange(event);
          }}
        />
        {errors.cpf && <span className="error">{errors.cpf.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="favoriteColor">Cor preferida</label>
        <select id="favoriteColor" {...register("favoriteColor")}>
          <option value="" disabled>
            Selecione uma cor
          </option>
          {colors.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
        {errors.favoriteColor && (
          <span className="error">{errors.favoriteColor.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="notes">Observações</label>
        <textarea id="notes" rows={3} {...register("notes")} />
        {errors.notes && <span className="error">{errors.notes.message}</span>}
      </div>

      <button className="btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar cadastro"}
      </button>
    </form>
  );
}
