import db from '../models';
import { reject, resolve } from 'q';
const Sequelize = db.Sequelize;


//import ListadoPropinas from '../components/Pagos/ListadoPropinas';

/**
 * CONSULTAR UN USURIO POR ID
 */
export function crearTabla(ventaId) {
  return new Promise((resolve, reject) => {
    db.ventas
      .findByPk(ventaId)
      .then(venta => {
        resolve(venta);
      })
      .catch(err => {
        console.log('ERROR AL consultarVenta', err);
        reject(err);
      });
  });
}

