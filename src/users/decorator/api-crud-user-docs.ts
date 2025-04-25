import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

type CrudAction = 'getAll' | 'getOne' | 'create' | 'update' | 'delete';

export function ApiCrudUserDocsDecorator(action: CrudAction) {
  const base = applyDecorators(ApiBearerAuth());

  const actions: Record<CrudAction, () => ReturnType<typeof applyDecorators>> =
    {
      create: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Crear un nuevo usuario (Solo Admin)' }),
          ApiResponse({
            status: 201,
            description: 'Usuario creado correctamente',
            type: User,
          }),
          ApiResponse({
            status: 409,
            description: 'El usuario ya existe',
          }),
          ApiResponse({
            status: 400,
            description: 'Ingrese los campos correctamente',
            schema: {
              example: {
                statusCode: 400,
                message: [
                  'El nombre no debe estar vacío',
                  'El apellido no debe estar vacío',
                ],
              },
            },
          }),
          ApiResponse({
            status: 403,
            description: 'No tienes permisos para acceder a este recurso',
          }),
          ApiResponse({ status: 404, description: 'Sede no encontrada' }),
          ApiResponse({
            status: 500,
            description: 'Error interno del servidor',
          }),
        ),
      getAll: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Listar todos los usuarios (Solo Admin)' }),
          ApiResponse({
            status: 200,
            description: 'Lista de todos los usuarios',
            type: User,
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
          ApiOperation({ summary: 'Obtener un usuario por ID (Solo Admin)' }),
          ApiResponse({
            status: 200,
            description: 'Obtiene un usuario',
            type: User,
          }),
          ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
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
      delete: () =>
        applyDecorators(
          base,
          ApiOperation({ summary: 'Eliminar un usuario por ID (Solo Admin)' }),
          ApiResponse({
            status: 200,
            description: 'Usuario eliminado correctamente',
          }),
          ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
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
      update: () =>
        applyDecorators(
          base,
          ApiOperation({
            summary: 'Actualizar un usuario por ID (Solo Admin)',
          }),
        ),
    };

  return actions[action]();
}
