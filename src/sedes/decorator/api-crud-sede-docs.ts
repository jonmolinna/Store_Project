import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Sede } from '../entity/sede.entity';

type CrudAction = 'getAll' | 'getOne' | 'create' | 'update' | 'delete';

export function ApiCrudSedeDocsDecorator(action: CrudAction) {
  const base = applyDecorators(ApiBearerAuth());

  const actions: Record<CrudAction, () => ReturnType<typeof applyDecorators>> =
    {
      getAll: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Listar todos los sedes (Solo Admin)' }),
          ApiResponse({
            status: 200,
            description: 'Lista de todos los sedes',
            type: Sede,
            isArray: true,
          }),
          ApiResponse({
            status: 403,
            description: 'No tienes permisos para acceder a este recurso',
          }),
          ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
          }),
        ),
      getOne: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Obtener una sede por ID (Solo Admin)' }),
          ApiResponse({
            status: 200,
            description: 'Obtiene una sede',
            type: Sede,
          }),
          ApiResponse({ status: 404, description: 'Sede no encontrada' }),
          ApiResponse({ status: 400, description: 'Ingrese un ID válido' }),
          ApiResponse({
            status: 403,
            description: 'No tienes permisos para acceder a este recurso',
          }),
          ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
          }),
        ),
      create: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Crear una nueva sede (Solo Admin)' }),
          ApiResponse({
            status: 201,
            description: 'Sede creada correctamente',
            type: Sede,
          }),
          ApiResponse({
            status: 400,
            description: 'Ingrese los campos correctamente',
            schema: {
              example: {
                statusCode: 400,
                message: [
                  'El nombre es obligatorio',
                  'La dirección es obligatoria',
                ],
              },
            },
          }),
          ApiResponse({
            status: 409,
            description: 'Ya existe una sede con ese nombre',
          }),
          ApiResponse({
            status: 403,
            description: 'No tienes permisos para acceder a este recurso',
          }),
          ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
          }),
        ),
      delete: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Eliminar una sede por ID (Solo Admin)' }),
          ApiResponse({
            status: 200,
            description: 'Sede eliminada correctamente',
          }),
          ApiResponse({ status: 404, description: 'Sede no encontrada' }),
          ApiResponse({ status: 400, description: 'Ingrese un ID válido' }),
          ApiResponse({
            status: 403,
            description: 'No tienes permisos para acceder a este recurso',
          }),
          ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
          }),
        ),
      update: () => applyDecorators(
        base,
        ApiOperation({ summary: 'Actualizar una sede por ID (Solo Admin)' }),
      )
    };

  return actions[action]();
}
