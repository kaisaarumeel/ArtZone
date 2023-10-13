<script>
import { Api } from '../Api'
export default {
  props: {
    isLoggedIn: Boolean(false),
    usedForRegister: Boolean(false)
  },
  computed: {
    passwordStrength: function () {
      return ((this.user.password.length < 8 || !/\d/.test(this.user.password) || undefined) ? 'Weak' : 'Strong')
    }
  },
  data() {
    return {
      clone: {
        name: {
          firstName: '',
          lastName: ''
        },
        dateOfBirth: '',
        userEmail: '',
        password: '',
        address: {
          street: '',
          city: '',
          zip: '',
          country: ''
        }
      },
      user: {
        name: {
          firstName: '',
          lastName: ''
        },
        dateOfBirth: '',
        userEmail: '',
        password: '',
        address: {
          street: '',
          city: '',
          zip: '',
          country: ''
        }
      },
      countries: [
        { text: 'Afghanistan', value: 'AF' },
        { text: 'land Islands', value: 'AX' },
        { text: 'Albania', value: 'AL' },
        { text: 'Algeria', value: 'DZ' },
        { text: 'American Samoa', value: 'AS' },
        { text: 'AndorrA', value: 'AD' },
        { text: 'Angola', value: 'AO' },
        { text: 'Anguilla', value: 'AI' },
        { text: 'Antarctica', value: 'AQ' },
        { text: 'Antigua and Barbuda', value: 'AG' },
        { text: 'Argentina', value: 'AR' },
        { text: 'Armenia', value: 'AM' },
        { text: 'Aruba', value: 'AW' },
        { text: 'Australia', value: 'AU' },
        { text: 'Austria', value: 'AT' },
        { text: 'Azerbaijan', value: 'AZ' },
        { text: 'Bahamas', value: 'BS' },
        { text: 'Bahrain', value: 'BH' },
        { text: 'Bangladesh', value: 'BD' },
        { text: 'Barbados', value: 'BB' },
        { text: 'Belarus', value: 'BY' },
        { text: 'Belgium', value: 'BE' },
        { text: 'Belize', value: 'BZ' },
        { text: 'Benin', value: 'BJ' },
        { text: 'Bermuda', value: 'BM' },
        { text: 'Bhutan', value: 'BT' },
        { text: 'Bolivia', value: 'BO' },
        { text: 'Bosnia and Herzegovina', value: 'BA' },
        { text: 'Botswana', value: 'BW' },
        { text: 'Bouvet Island', value: 'BV' },
        { text: 'Brazil', value: 'BR' },
        { text: 'British Indian Ocean Territory', value: 'IO' },
        { text: 'Brunei Darussalam', value: 'BN' },
        { text: 'Bulgaria', value: 'BG' },
        { text: 'Burkina Faso', value: 'BF' },
        { text: 'Burundi', value: 'BI' },
        { text: 'Cambodia', value: 'KH' },
        { text: 'Cameroon', value: 'CM' },
        { text: 'Canada', value: 'CA' },
        { text: 'Cape Verde', value: 'CV' },
        { text: 'Cayman Islands', value: 'KY' },
        { text: 'Central African Republic', value: 'CF' },
        { text: 'Chad', value: 'TD' },
        { text: 'Chile', value: 'CL' },
        { text: 'China', value: 'CN' },
        { text: 'Christmas Island', value: 'CX' },
        { text: 'Cocos (Keeling) Islands', value: 'CC' },
        { text: 'Colombia', value: 'CO' },
        { text: 'Comoros', value: 'KM' },
        { text: 'Congo', value: 'CG' },
        { text: 'Congo, The Democratic Republic of the', value: 'CD' },
        { text: 'Cook Islands', value: 'CK' },
        { text: 'Costa Rica', value: 'CR' },
        { text: "Cote D'Ivoire", value: 'CI' },
        { text: 'Croatia', value: 'HR' },
        { text: 'Cuba', value: 'CU' },
        { text: 'Cyprus', value: 'CY' },
        { text: 'Czech Republic', value: 'CZ' },
        { text: 'Denmark', value: 'DK' },
        { text: 'Djibouti', value: 'DJ' },
        { text: 'Dominica', value: 'DM' },
        { text: 'Dominican Republic', value: 'DO' },
        { text: 'Ecuador', value: 'EC' },
        { text: 'Egypt', value: 'EG' },
        { text: 'El Salvador', value: 'SV' },
        { text: 'Equatorial Guinea', value: 'GQ' },
        { text: 'Eritrea', value: 'ER' },
        { text: 'Estonia', value: 'EE' },
        { text: 'Ethiopia', value: 'ET' },
        { text: 'Falkland Islands (Malvinas)', value: 'FK' },
        { text: 'Faroe Islands', value: 'FO' },
        { text: 'Fiji', value: 'FJ' },
        { text: 'Finland', value: 'FI' },
        { text: 'France', value: 'FR' },
        { text: 'French Guiana', value: 'GF' },
        { text: 'French Polynesia', value: 'PF' },
        { text: 'French Southern Territories', value: 'TF' },
        { text: 'Gabon', value: 'GA' },
        { text: 'Gambia', value: 'GM' },
        { text: 'Georgia', value: 'GE' },
        { text: 'Germany', value: 'DE' },
        { text: 'Ghana', value: 'GH' },
        { text: 'Gibraltar', value: 'GI' },
        { text: 'Greece', value: 'GR' },
        { text: 'Greenland', value: 'GL' },
        { text: 'Grenada', value: 'GD' },
        { text: 'Guadeloupe', value: 'GP' },
        { text: 'Guam', value: 'GU' },
        { text: 'Guatemala', value: 'GT' },
        { text: 'Guernsey', value: 'GG' },
        { text: 'Guinea', value: 'GN' },
        { text: 'Guinea-Bissau', value: 'GW' },
        { text: 'Guyana', value: 'GY' },
        { text: 'Haiti', value: 'HT' },
        { text: 'Heard Island and Mcdonald Islands', value: 'HM' },
        { text: 'Holy See (Vatican City State)', value: 'VA' },
        { text: 'Honduras', value: 'HN' },
        { text: 'Hong Kong', value: 'HK' },
        { text: 'Hungary', value: 'HU' },
        { text: 'Iceland', value: 'IS' },
        { text: 'India', value: 'IN' },
        { text: 'Indonesia', value: 'ID' },
        { text: 'Iran, Islamic Republic Of', value: 'IR' },
        { text: 'Iraq', value: 'IQ' },
        { text: 'Ireland', value: 'IE' },
        { text: 'Isle of Man', value: 'IM' },
        { text: 'Israel', value: 'IL' },
        { text: 'Italy', value: 'IT' },
        { text: 'Jamaica', value: 'JM' },
        { text: 'Japan', value: 'JP' },
        { text: 'Jersey', value: 'JE' },
        { text: 'Jordan', value: 'JO' },
        { text: 'Kazakhstan', value: 'KZ' },
        { text: 'Kenya', value: 'KE' },
        { text: 'Kiribati', value: 'KI' },
        { text: "Korea, Democratic People'S Republic of", value: 'KP' },
        { text: 'Korea, Republic of', value: 'KR' },
        { text: 'Kuwait', value: 'KW' },
        { text: 'Kyrgyzstan', value: 'KG' },
        { text: "Lao People'S Democratic Republic", value: 'LA' },
        { text: 'Latvia', value: 'LV' },
        { text: 'Lebanon', value: 'LB' },
        { text: 'Lesotho', value: 'LS' },
        { text: 'Liberia', value: 'LR' },
        { text: 'Libyan Arab Jamahiriya', value: 'LY' },
        { text: 'Liechtenstein', value: 'LI' },
        { text: 'Lithuania', value: 'LT' },
        { text: 'Luxembourg', value: 'LU' },
        { text: 'Macao', value: 'MO' },
        { text: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
        { text: 'Madagascar', value: 'MG' },
        { text: 'Malawi', value: 'MW' },
        { text: 'Malaysia', value: 'MY' },
        { text: 'Maldives', value: 'MV' },
        { text: 'Mali', value: 'ML' },
        { text: 'Malta', value: 'MT' },
        { text: 'Marshall Islands', value: 'MH' },
        { text: 'Martinique', value: 'MQ' },
        { text: 'Mauritania', value: 'MR' },
        { text: 'Mauritius', value: 'MU' },
        { text: 'Mayotte', value: 'YT' },
        { text: 'Mexico', value: 'MX' },
        { text: 'Micronesia, Federated States of', value: 'FM' },
        { text: 'Moldova, Republic of', value: 'MD' },
        { text: 'Monaco', value: 'MC' },
        { text: 'Mongolia', value: 'MN' },
        { text: 'Montenegro', value: 'ME' },
        { text: 'Montserrat', value: 'MS' },
        { text: 'Morocco', value: 'MA' },
        { text: 'Mozambique', value: 'MZ' },
        { text: 'Myanmar', value: 'MM' },
        { text: 'Namibia', value: 'NA' },
        { text: 'Nauru', value: 'NR' },
        { text: 'Nepal', value: 'NP' },
        { text: 'Netherlands', value: 'NL' },
        { text: 'Netherlands Antilles', value: 'AN' },
        { text: 'New Caledonia', value: 'NC' },
        { text: 'New Zealand', value: 'NZ' },
        { text: 'Nicaragua', value: 'NI' },
        { text: 'Niger', value: 'NE' },
        { text: 'Nigeria', value: 'NG' },
        { text: 'Niue', value: 'NU' },
        { text: 'Norfolk Island', value: 'NF' },
        { text: 'Northern Mariana Islands', value: 'MP' },
        { text: 'Norway', value: 'NO' },
        { text: 'Oman', value: 'OM' },
        { text: 'Pakistan', value: 'PK' },
        { text: 'Palau', value: 'PW' },
        { text: 'Palestinian Territory, Occupied', value: 'PS' },
        { text: 'Panama', value: 'PA' },
        { text: 'Papua New Guinea', value: 'PG' },
        { text: 'Paraguay', value: 'PY' },
        { text: 'Peru', value: 'PE' },
        { text: 'Philippines', value: 'PH' },
        { text: 'Pitcairn', value: 'PN' },
        { text: 'Poland', value: 'PL' },
        { text: 'Portugal', value: 'PT' },
        { text: 'Puerto Rico', value: 'PR' },
        { text: 'Qatar', value: 'QA' },
        { text: 'Reunion', value: 'RE' },
        { text: 'Romania', value: 'RO' },
        { text: 'Russian Federation', value: 'RU' },
        { text: 'RWANDA', value: 'RW' },
        { text: 'Saint Helena', value: 'SH' },
        { text: 'Saint Kitts and Nevis', value: 'KN' },
        { text: 'Saint Lucia', value: 'LC' },
        { text: 'Saint Pierre and Miquelon', value: 'PM' },
        { text: 'Saint Vincent and the Grenadines', value: 'VC' },
        { text: 'Samoa', value: 'WS' },
        { text: 'San Marino', value: 'SM' },
        { text: 'Sao Tome and Principe', value: 'ST' },
        { text: 'Saudi Arabia', value: 'SA' },
        { text: 'Senegal', value: 'SN' },
        { text: 'Serbia', value: 'RS' },
        { text: 'Seychelles', value: 'SC' },
        { text: 'Sierra Leone', value: 'SL' },
        { text: 'Singapore', value: 'SG' },
        { text: 'Slovakia', value: 'SK' },
        { text: 'Slovenia', value: 'SI' },
        { text: 'Solomon Islands', value: 'SB' },
        { text: 'Somalia', value: 'SO' },
        { text: 'South Africa', value: 'ZA' },
        { text: 'South Georgia and the South Sandwich Islands', value: 'GS' },
        { text: 'Spain', value: 'ES' },
        { text: 'Sri Lanka', value: 'LK' },
        { text: 'Sudan', value: 'SD' },
        { text: 'Suriname', value: 'SR' },
        { text: 'Svalbard and Jan Mayen', value: 'SJ' },
        { text: 'Swaziland', value: 'SZ' },
        { text: 'Sweden', value: 'SE' },
        { text: 'Switzerland', value: 'CH' },
        { text: 'Syrian Arab Republic', value: 'SY' },
        { text: 'Taiwan, Province of China', value: 'TW' },
        { text: 'Tajikistan', value: 'TJ' },
        { text: 'Tanzania, United Republic of', value: 'TZ' },
        { text: 'Thailand', value: 'TH' },
        { text: 'Timor-Leste', value: 'TL' },
        { text: 'Togo', value: 'TG' },
        { text: 'Tokelau', value: 'TK' },
        { text: 'Tonga', value: 'TO' },
        { text: 'Trinidad and Tobago', value: 'TT' },
        { text: 'Tunisia', value: 'TN' },
        { text: 'Turkey', value: 'TR' },
        { text: 'Turkmenistan', value: 'TM' },
        { text: 'Turks and Caicos Islands', value: 'TC' },
        { text: 'Tuvalu', value: 'TV' },
        { text: 'Uganda', value: 'UG' },
        { text: 'Ukraine', value: 'UA' },
        { text: 'United Arab Emirates', value: 'AE' },
        { text: 'United Kingdom', value: 'GB' },
        { text: 'United States', value: 'US' },
        { text: 'United States Minor Outlying Islands', value: 'UM' },
        { text: 'Uruguay', value: 'UY' },
        { text: 'Uzbekistan', value: 'UZ' },
        { text: 'Vanuatu', value: 'VU' },
        { text: 'Venezuela', value: 'VE' },
        { text: 'Viet Nam', value: 'VN' },
        { text: 'Virgin Islands, British', value: 'VG' },
        { text: 'Virgin Islands, U.S.', value: 'VI' },
        { text: 'Wallis and Futuna', value: 'WF' },
        { text: 'Western Sahara', value: 'EH' },
        { text: 'Yemen', value: 'YE' },
        { text: 'Zambia', value: 'ZM' },
        { text: 'Zimbabwe', value: 'ZW' }
      ]
    }
  },
  methods: {
    /*
    A method used to check if two objects are totally different. We do this recursively.
    */
    async totallyDifferentObjects(obj1, obj2) {
      for (const key in obj1) {
        if (typeof obj1[key] === 'object') {
          return this.totallyDifferentObjects(obj1[key], obj2[key])
        } else {
          if (obj1[key] === obj2[key]) {
            return false
          }
        }
      }
      return true
    },
    async emitData() {
      const userLength = Object.keys(this.user).length
      const cloneLength = Object.keys(this.clone).length

      if (userLength !== cloneLength) throw Error('User and Clone object to not have the same key length!')
      const totallyDifferent = await this.totallyDifferentObjects(this.user, this.clone)
      const emittedUser = JSON.parse(JSON.stringify(this.user))
      emittedUser.totallyDifferent = totallyDifferent
      this.$emit('form-data', emittedUser)
    },
    async getUser() {
      if (this.isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem('userData'))
        try {
          const url = `/users/${userData.userEmail}`
          const response = await Api.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': userData.sessionKey
            }
          })
          if (response.status === 200) {
            const date = new Date(response.data.dateOfBirth)
            let dateDay = String(date.getDate())
            if (dateDay.length < 2) dateDay = '0' + dateDay
            let dateMonth = String(date.getMonth() + 1)
            if (dateMonth.length < 2) dateMonth = '0' + dateMonth
            const dateString = date.getFullYear() + '-' + dateMonth + '-' + dateDay
            response.data.password = ''
            this.user = response.data
            this.clone = JSON.parse(JSON.stringify(this.user))
            this.user.dateOfBirth = dateString
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    getMaxDateOfBirth() {
      const currentDate = new Date()
      currentDate.setFullYear(currentDate.getFullYear() - 16) // Minimum age is 16
      return currentDate.toISOString().split('T')[0]
    },
    getMinDateOfBirth() {
      const currentDate = new Date()
      currentDate.setFullYear(currentDate.getFullYear() - 100) // Maximum age is 100
      return currentDate.toISOString().split('T')[0]
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<template>
  <div v-if="user" class="">
    <b-row>
      <b-col cols="6">
        <label> First name </label>
        <b-form-input class="input" id="firstName-input" v-model="user.name.firstName" type="text"
          placeholder="Enter your first name"></b-form-input>
      </b-col>
      <b-col cols="6">
        <label> Last name </label>
        <b-form-input class="input" id="lastName-input" v-model="user.name.lastName" type="text"
          placeholder="Enter your last name"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <label> Date of birth </label>
        <b-form-input class="input" id="birthDate-input" v-model="user.dateOfBirth" type="date"
          placeholder="Enter your birth date" required :min="getMinDateOfBirth()"
          :max="getMaxDateOfBirth()"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <label> Email </label>
        <b-form-input class="input" id="email-input" v-model="user.userEmail" type="email" placeholder="bob@gmail.com"
          required></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <label> Password </label>
        <b-form-input class="input" id="password-input" v-model="user.password" type="password"
          placeholder="Enter your password" required></b-form-input>
        <p v-if="passwordStrength === 'Weak'">Password must be at least 8 characters long and contain at least one number.
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <label> Street </label>
        <b-form-input class="input" id="street-input" v-model="user.address.street" type="text"
          placeholder="Enter your street name" required></b-form-input>
      </b-col>
      <b-col cols="6">
        <label> City </label>
        <b-form-input class="input" id="city-input" v-model="user.address.city" type="text"
          placeholder="Enter your city name" required></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <label> ZIP </label>
        <b-form-input class="input" id="zip-input" v-model="user.address.zip" type="number" placeholder="75234" min="0"
          required></b-form-input>
      </b-col>
      <b-col cols="6">
        <label> Country </label>
        <b-form-select id="country-input" class="input" v-model="user.address.country" :options="countries"
          requred></b-form-select>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="12 text-center">
        <button class="mt-4 btn btn-primary" :disabled="(passwordStrength === 'Weak' && usedForRegister===true) || (passwordStrength === 'Weak' && user.password.length>0)" @click="emitData()">
          <slot>Save</slot>
        </button>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
.input {
  background-color: #50604c21;
  border: none;
  border-radius: 0px;
}

.input:focus {
  background-color: #50604c21;
  color: #606C5D;
}

button {
  border: 1px solid #F7E6C4;
}

button:hover {
  text-decoration: underline;
  text-decoration-color: #606C5D;
  background-color: #F7E6C4;
  border: 1px solid #606C5D !important;
}

button:disabled {
  text-decoration: underline;
  text-decoration-color: #606C5D;
  background-color: #F7E6C4;
  border: 1px solid #606C5D !important;
  color: #606C5D;
}
</style>
