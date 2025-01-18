import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('workout_planner', 'springstudent', 'springstudent', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;
