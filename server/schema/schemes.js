import { DataTypes } from 'sequelize'
import { db_main } from '../config/db-config.js'
import {
	DIRECTOR,
	SUPERVISOR,
	GENERAL_ADMIN,
	ACCESS_MANAGER,
	TECHNICAL_ANALYST,
} from '../shared/constants/roles-const.js'
import { REACTIVE_UNIT } from '../shared/constants/unitsMeasurement-const.js'
import { KARDEX_ADJUSTMENT, KARDEX_ENTRY, KARDEX_RETURN } from '../shared/constants/kardexValues-const.js'
import {
	SAMPLE_EXTERNAL,
	SAMPLE_GASEOUS,
	SAMPLE_LIQUID,
	SAMPLE_PROJECT,
	SAMPLE_SOLID,
	SAMPLE_THESIS,
} from '../shared/constants/sample-const.js'
import { QUOTE } from '../shared/constants/payment-const.js'
import { STATUS_ACCESS, TYPE_ACCESS } from '../shared/constants/access-const.js'

/* ------------------------------- SYSTEM CONFIG -----------------------------*/

export const system_config_Schema = db_main.define(
	'system_config',
	{
		id_config: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		institution_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		institution_logo: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		slogan: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		contact_email: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isEmail: true,
			},
		},
		contact_phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		fb: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		x: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		ig: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		yt: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: 'system_config',
	}
)

/* ------------------------------- ROLES -----------------------------*/

export const rol_Schema = db_main.define(
	'roles',
	{
		id_rol: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		type_rol: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [[GENERAL_ADMIN, DIRECTOR, SUPERVISOR, TECHNICAL_ANALYST, ACCESS_MANAGER]],
			},
		},
	},
	{
		timestamps: true,
		tableName: 'roles',
	}
)

/* ------------------------------- USERS -----------------------------*/

export const user_Schema = db_main.define(
	'users',
	{
		id_user: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(10),
			allowNull: true,
			validate: {
				is: /^[0-9]+$/,
			},
		},
		identification_card: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: 'users',
	}
)

/* ------------------------------- USERS ROLE - INTERMEDIATE -----------------------------*/

export const user_role_main_Schema = db_main.define(
	'user_roles_intermediate',
	{
		id_user_role_intermediate: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_user_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'user_roles_intermediate',
	}
)

// Relación Uno a Uno (1:1)
// Un único registro de user_role_main_Schema está asociado a un único usuario en user_Schema.
user_role_main_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_user_fk',
	sourceKey: 'id_user',
	onDelete: 'CASCADE',
})

// Relación Uno a Uno (1:1)
// Un usuario en user_Schema tiene un único registro en user_role_main_Schema.
user_Schema.hasOne(user_role_main_Schema, {
	foreignKey: 'id_user_fk',
	targetKey: 'id_user',
	onDelete: 'CASCADE',
})

/* ------------------------------- USERS ROLES -----------------------------*/

export const user_roles_Schema = db_main.define(
	'user_roles',
	{
		id_user_roles: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_user_role_intermediate_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'user_roles_intermediate',
				key: 'id_user_role_intermediate',
			},
		},
		id_rol_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'roles',
				key: 'id_rol',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'user_roles',
	}
)

// Relación Muchos a Uno (n:1)
// Muchos registros de user_roles_Schema están asociados a un único registro en user_role_main_Schema.
user_roles_Schema.belongsTo(user_role_main_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	sourceKey: 'id_user_role_intermediate',
	onDelete: 'CASCADE',
})

// Relación Uno a Muchos (1:n)
// Un registro de user_role_main_Schema puede tener muchos registros asociados en user_roles_Schema.
user_role_main_Schema.hasMany(user_roles_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	targetKey: 'id_user_role_intermediate',
	onDelete: 'CASCADE',
})

// Relación Muchos a Uno (n:1)
// Muchos registros de user_roles_Schema están asociados a un único registro de rol_Schema.
user_roles_Schema.belongsTo(rol_Schema, {
	foreignKey: 'id_rol_fk',
	sourceKey: 'id_rol',
})

// Relación Uno a Muchos (1:n)
// Un registro de rol_Schema puede tener muchos registros asociados en user_roles_Schema.
rol_Schema.hasMany(user_roles_Schema, {
	foreignKey: 'id_rol_fk',
	targetKey: 'id_rol',
})

// Relación Muchos a Uno (n:1)
// Muchos registros de user_roles_Schema están asociados a un único registro de user_Schema.
user_roles_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	sourceKey: 'id_user_fk',
	onDelete: 'CASCADE',
})

// Relación Uno a Muchos (1:n)
// Un usuario en user_Schema puede tener muchos roles asociados en user_roles_Schema.
user_Schema.hasMany(user_roles_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	targetKey: 'id_user_fk',
	onDelete: 'CASCADE',
})

/* ------------------------------- TOKEN -----------------------------*/

export const token_Schema = db_main.define(
	'tokens',
	{
		id_token: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_user_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		used: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		tableName: 'tokens',
	}
)

// Relación Uno a Uno (1:1)
// Un usuario tiene un único token
user_Schema.hasOne(token_Schema, {
	foreignKey: 'id_user_fk',
	sourceKey: 'id_user',
})

/* ------------------------------- LABORATORY -----------------------------*/

export const laboratory_Schema = db_main.define(
	'laboratories',
	{
		id_lab: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: 'laboratories',
	}
)

/* ------------------------------- LABS <-> ANALYS -----------------------------*/

export const laboratory_analyst_Schema = db_main.define(
	'laboratory_analysts',
	{
		id_laboratory_analysts: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_lab_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'laboratories',
				key: 'id_lab',
			},
		},
		id_analyst_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'laboratory_analysts',
	}
)

// Un laboratorio tiene un único analista (relación 1:1)
laboratory_Schema.hasOne(laboratory_analyst_Schema, {
	foreignKey: 'id_lab_fk',
})

// Un analista pertenece a un único laboratorio (relación 1:1)
laboratory_analyst_Schema.belongsTo(laboratory_Schema, {
	foreignKey: 'id_lab_fk',
})

// Un analista se refiere a un usuario (relación 1:1)
laboratory_analyst_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_analyst_fk',
})

// Un usuario puede ser asignado a un único laboratorio a través de la tabla intermedia (relación 1:1)
user_Schema.hasOne(laboratory_analyst_Schema, {
	foreignKey: 'id_analyst_fk',
})

/* ------------------------------- FACULTY -----------------------------*/

export const faculty_Scheme = db_main.define(
	'faculties',
	{
		id_faculty: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'faculties',
	}
)

/* ------------------------------- CAREER -----------------------------*/

export const career_Scheme = db_main.define(
	'careers',
	{
		id_career: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		id_faculty_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'faculties',
				key: 'id_faculty',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'careers',
	}
)

faculty_Scheme.hasMany(career_Scheme, {
	foreignKey: 'id_faculty_fk',
	sourceKey: 'id_faculty',
})

career_Scheme.belongsTo(faculty_Scheme, {
	foreignKey: 'id_faculty_fk',
	sourceKey: 'id_faculty',
})

/* ------------------------------- EXPERIMENTS -----------------------------*/

export const experiments_Scheme = db_main.define(
	'experiments',
	{
		id_experiment: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		public_price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		internal_price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		timestamps: true,
		tableName: 'experiments',
	}
)

/* ------------------------------- ACCESS -----------------------------*/

export const access_Scheme = db_main.define(
	'access',
	{
		id_access: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		type_access: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [[TYPE_ACCESS.INTERNAL, TYPE_ACCESS.PUBLIC]],
			},
		},
		reason: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		topic: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		startTime: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		endTime: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		analysis_required: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		observations: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: STATUS_ACCESS.PENDING,
			validate: {
				isIn: [[STATUS_ACCESS.PENDING, STATUS_ACCESS.APPROVED, STATUS_ACCESS.REJECTED]],
			},
		},
	},
	{
		timestamps: true,
		tableName: 'access',
	}
)

/* ------------------------------- ACCESS <-> FACULTY -----------------------------*/

export const access_faculty_Scheme = db_main.define(
	'access_faculty',
	{
		id_access_faculty: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_faculty_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'faculties',
				key: 'id_faculty',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'access_faculty',
	}
)

// Relación Muchos a Uno (n:1)
// Un registro en access_faculty está asociado a un único acceso.
access_faculty_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
})

// Relación Uno a Muchos (1:n)
// Un acceso puede estar asociado a varias facultades.
access_Scheme.hasMany(access_faculty_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
})

// Definir la relación en el modelo `access_faculty`:
access_faculty_Scheme.belongsTo(faculty_Scheme, {
	foreignKey: 'id_faculty_fk',
	targetKey: 'id_faculty',
})

// Definir la relación en el modelo `faculty_Scheme`:
faculty_Scheme.hasMany(access_faculty_Scheme, {
	foreignKey: 'id_faculty_fk',
	sourceKey: 'id_faculty',
})

/* ------------------------------- ACCESS <-> CAREER -----------------------------*/

export const access_career_Scheme = db_main.define(
	'access_career',
	{
		id_access_career: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_career_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'careers',
				key: 'id_career',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'access_career',
	}
)

// Relación Muchos a Uno (n:1)
// Un registro en access_career está asociado a un único acceso.
access_career_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
})

// Relación Uno a Muchos (1:n)
// Un acceso puede estar asociado a varias carreras.
access_Scheme.hasMany(access_career_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
})

// Definir la relación en el modelo `career_Scheme`:
access_career_Scheme.belongsTo(career_Scheme, {
	foreignKey: 'id_career_fk',
	targetKey: 'id_career',
})

// Definir la relación en el modelo `career_Scheme`:
career_Scheme.hasMany(access_career_Scheme, {
	foreignKey: 'id_career_fk',
	sourceKey: 'id_career',
})

/* ------------------------------- ACCESS <-> DIRECTOR -----------------------------*/

export const access_director_Scheme = db_main.define(
	'access_director',
	{
		id_access_director: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dni: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'access_director',
	}
)

// Relación Muchos a Uno (n:1)
// Un registro en access_director está asociado a un único acceso.
access_director_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
})

// Relación Uno a Muchos (1:n)
// Un acceso puede estar asociado a varios directores.
access_Scheme.hasMany(access_director_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
})

/* ------------------------------- ACCESS <-> APLICANTS -----------------------------*/

export const access_applicant_Scheme = db_main.define(
	'access_applicants',
	{
		id_access_applicant: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dni: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'access_applicants',
	}
)

// Relación Muchos a Uno (n:1)
// Un solicitante está asociado a un único acceso.
access_applicant_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
})

// Relación Uno a Muchos (1:n)
// Un acceso puede tener varios solicitantes asociados.
access_Scheme.hasMany(access_applicant_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
})

/* ------------------------------- ACCESS <-> LABS -----------------------------*/

export const access_lab_Scheme = db_main.define(
	'access_labs',
	{
		id_access_lab: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_lab_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'laboratories',
				key: 'id_lab',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'access_labs',
	}
)

// Relación Muchos a Uno (n:1)
// Un detalle de acceso está asociado a un único acceso.
access_lab_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
})

// Relación Uno a Muchos (1:n)
// Un acceso puede tener múltiples detalles asociados.
access_Scheme.hasMany(access_lab_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
})

// Un laboratorio puede estar relacionado con múltiples detalles de acceso
laboratory_Schema.hasMany(access_lab_Scheme, {
	foreignKey: 'id_lab_fk',
	sourceKey: 'id_lab',
})

// Un detalle de acceso pertenece a un laboratorio
access_lab_Scheme.belongsTo(laboratory_Schema, {
	foreignKey: 'id_lab_fk',
	targetKey: 'id_lab',
})

/* ------------------------------- UNIT MEASUREMENT -----------------------------*/

export const unit_measurement_Schema = db_main.define(
	'units_measurements',
	{
		id_unit_measurement: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		unit: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'units_measurements',
	}
)

/* ------------------------------- REACTIVES -----------------------------*/

export const reactive_Schema = db_main.define(
	'reactives',
	{
		id_reactive: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		status: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		number_of_containers: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		initial_quantity: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		current_quantity: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		id_unit_measurement_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'units_measurements',
				key: 'id_unit_measurement',
			},
		},
		cas: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		expiration_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		quantity_consumed: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_controlled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'reactives',
	}
)

reactive_Schema.belongsTo(unit_measurement_Schema, {
	foreignKey: 'id_unit_measurement_fk',
	targetKey: 'id_unit_measurement',
})

unit_measurement_Schema.hasMany(reactive_Schema, {
	foreignKey: 'id_unit_measurement_fk',
	targetKey: 'id_unit_measurement',
})

/* ------------------------------- SAMPLES -----------------------------*/

export const sample_Schema = db_main.define(
	'samples',
	{
		id_sample: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
		},
		applicant_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		identification_card: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		sample_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		sample_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		container: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		state: {
			type: DataTypes.ENUM(SAMPLE_LIQUID, SAMPLE_SOLID, SAMPLE_GASEOUS),
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM(SAMPLE_THESIS, SAMPLE_PROJECT, SAMPLE_EXTERNAL),
			allowNull: false,
		},
		id_analyst_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		report_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		tableName: 'samples',
	}
)

// Relación Uno a Muchos (1:n)
// Un analista puede recibir varios muestras.
user_Schema.hasMany(sample_Schema, {
	foreignKey: 'id_analyst_fk',
	sourceKey: 'id_user',
})

// Relación Muchos a Uno (n:1)
// Varios muetras pueden estár asociado a un mismo analista.
sample_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_analyst_fk',
	targetKey: 'id_user',
})

/* ------------------------------- KARDEX -----------------------------*/

export const kardex_Schema = db_main.define(
	'kardex',
	{
		id_kardex: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_reactive_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'reactives',
				key: 'id_reactive',
			},
		},
		action_type: {
			type: DataTypes.ENUM(KARDEX_ADJUSTMENT, KARDEX_ENTRY, KARDEX_RETURN),
			allowNull: false,
		},
		id_responsible: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		quantity: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		balance_after_action: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: 'kardex',
	}
)

// Relación Muchos a Uno (n:1)
// Varios kardex de reactivos de reactivos pueden estár asociados a un único reactivo.
kardex_Schema.belongsTo(reactive_Schema, {
	foreignKey: 'id_reactive_fk',
	targetKey: 'id_reactive',
})

// Relación Muchos a Uno (n:1)
// Varios kardex de reactivos de reactivos pueden estár asociados a un único usuario.
kardex_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_reactive_fk',
	targetKey: 'id_user',
})

/* ------------------------------- LOGS -----------------------------*/

export const logs_Schema = db_main.define(
	'logs',
	{
		id_log: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		level: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_fk: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		httpMethod: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		action: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		meta: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		ipAddress: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		endpoint: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		timestamps: true,
		tableName: 'logs',
	}
)
