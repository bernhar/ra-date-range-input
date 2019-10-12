import { Component } from "react";
import moment from "moment";

export const isString = s => typeof s === "string" || s instanceof String;
/**
 * Class to display date range information based on a timePeriod record.
 *
 * @export
 * @class DateRangeField
 * @extends {Component}
 */
export default class DateRangeField extends Component {
  constructor(props) {
    super(props);

    this.setDefaults(this.defaultParams(), props);
  }

  /**
   * Default params to use if not provided to the component.
   *
   * @memberof DateRangeField
   */
  defaultParams = () => ({
    dateFormat: "DD/MM/YYYY",
    startName: "Starting",
    endName: "Ending",
    incName: "inclusive",
    strEmpty: "(empty)",
    strDiff: "Total days: ",
    isLiteralInfo: true,
    showDaysDiff: true,
    hideInclusiveFields: false
  });

  /**
   * Use a config object to populate 'this' with
   * values provided by 'props' either use values
   * from the config object itsel.
   *
   * @memberof DateRangeField
   * @param {object} objConfig These are the properties default to use if cant find in 'props'
   * @param {object} props Look here for properties
   */
  setDefaults = (objConfig, props) => {
    for (let [name, valDefault] of Object.entries(objConfig)) {
      this[name] =
        props[name] && isString(props[name]) ? props[name] : valDefault;
    }
  };

  /**
   * Given an timePeriod object, return if it is valid.
   *
   * @memberof DateRangeField
   */
  isValidRange = obj => {
    return (
      obj.start.value &&
      obj.end.value &&
      moment(obj.start.value) < moment(obj.end.value)
    );
  };

  /**
   * Translate the 'inclusive' fields to strings for display.
   *
   * @memberof DateRangeField
   * @param {string} str start or end
   */
  translateInclusive = str => {
    if (this.hideInclusiveFields) return "";
    let strRet = "(";
    strRet += this.props.record.timePeriod[str].inclusive ? "not " : "";
    strRet += this.incName + ")";
    return strRet;
  };

  /**
   * Produces a more detailed translation of the date range.
   *
   * @memberof DateRangeField
   * @param {moment} dtStart Start moment
   * @param {moment} dtEnd End moment
   */
  literalInfo = (dtStart, dtEnd) => {
    let strResult = "";
    const strIncStart = this.translateInclusive("start");
    const strIncEnd = this.translateInclusive("end");
    if (this.isValidRange(this.props.record.timePeriod)) {
      strResult += this.startName;
      if (dtStart.year() === dtEnd.year()) {
        if (dtStart.format("M") === dtEnd.format("M")) {
          strResult += ` ${dtStart.format(
            "DD"
          )} ${strIncStart} ${this.endName.toLowerCase()} ${dtEnd.format(
            "DD"
          )} ${strIncEnd} ${dtEnd.format("MMMM/YYYY")}.`;
        } else {
          strResult += ` ${dtStart.format(
            "DD/MMMM"
          )} ${strIncStart} ${this.endName.toLowerCase()} ${dtEnd.format(
            "DD/MMMM"
          )} ${strIncEnd} ${dtEnd.format("YYYY")}.`;
        }
      } else {
        strResult += ` ${dtStart.format(
          this.dateFormat
        )} ${strIncStart} ${this.endName.toLowerCase()} ${dtEnd.format(
          this.dateFormat
        )} ${strIncEnd}.`;
      }
      if (this.showDaysDiff) {
        strResult += " " + this.translateDaysDiff(dtStart, dtEnd);
      }
    } else if (dtStart) {
      strResult = `${this.startName} ${dtStart.format(
        this.dateFormat
      )} ${strIncStart}.`;
    } else if (dtEnd) {
      strResult = `${this.endName} ${dtEnd.format(
        this.dateFormat
      )} ${strIncEnd}.`;
    }
    return strResult;
  };

  /**
   * Produces the difference in days between the two moment dates.
   *
   * @memberof DateRangeField
   * @param {moment} dtStart Start moment
   * @param {moment} dtEnd End moment
   */
  translateDaysDiff = (dtStart, dtEnd) =>
    ` (${this.strDiff} ${dtEnd.diff(dtStart, "days")})`;

  /**
   * Produces strict information about the timePeriod interval.
   *
   * @memberof DateRangeField
   * @param {moment} dtStart Start moment
   * @param {moment} dtEnd End moment
   */
  strictInfo = (dtStart, dtEnd) => {
    let strResult = "";
    const strIncStart = this.translateInclusive("start");
    const strIncEnd = this.translateInclusive("end");
    if (this.isValidRange(this.props.record.timePeriod)) {
      strResult += ` ${dtStart.format(
        this.dateFormat
      )} ${strIncStart} --> ${dtEnd.format(this.dateFormat)} ${strIncEnd}.`;
      if (this.showDaysDiff) {
        strResult += " " + this.translateDaysDiff(dtStart, dtEnd);
      }
    } else if (dtStart) {
      strResult += `${dtStart.format(this.dateFormat)} ${strIncStart} --> ${
        this.strEmpty
      }.`;
    } else if (dtEnd) {
      strResult += `${this.strEmpty} --> ${dtEnd.format(
        this.dateFormat
      )} ${strIncEnd}.`;
    }
    return strResult;
  };

  /**
   * Get the 'inclusive' field translation based on the
   *
   * @memberof DateRangeField
   * @param {string} str start or end
   */
  translateIncLiteral = str =>
    this.props.record.timePeriod[str].inclusive
      ? this.translateInclusive(str)
      : "";

  /**
   * Produce a moment from a date
   *
   * @memberof DateRangeField
   * @param {string} str start or end
   */
  parseDateToMoment = str =>
    this.props.record.timePeriod[str].value
      ? moment(this.props.record.timePeriod[str].value)
      : null;

  render() {
    let strResult = "";
    const dtStart = this.parseDateToMoment("start");
    const dtEnd = this.parseDateToMoment("end");
    if (this.props.isLiteralInfo) {
      strResult = this.literalInfo(dtStart, dtEnd);
    } else {
      strResult = this.strictInfo(dtStart, dtEnd);
    }
    return strResult ? strResult : this.strEmpty;
  }
}
