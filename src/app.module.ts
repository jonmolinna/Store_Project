import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SedesModule } from './sedes/sedes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'molina125',
      database: 'store_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: true, 
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    SedesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
