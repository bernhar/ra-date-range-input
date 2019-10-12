import { Component } from "react";
import moment from "moment";

export const isString = s => typeof s === "string" || s instanceof String;

export default class DateRangeField extends Component {
  constructor(props) {
    super(props);

    for (let [key, value] of Object.entries(this.defaultParams())) {
      this.setDefaults(key, value);
    }
  }

  defaultParams = () => ({
    startName: "Starting",
    endName: "Ending",
    incName: "inclusive",
    strEmpty: "(empty)",
    strDiff: "Total days: ",
    dateFormat: "DD/MM/YYYY",
    isLiteralInfo: true,
    showDaysDiff: true,
    hideInclusiveFields: false
  });

  setDefaults = (name, valDefault) => {
    this[name] =
      this.props[name] && isString(this.props[name])
        ? this.props[name]
        : valDefault;
  };

  isValidRange = obj => {
    return (
      obj.start.value &&
      obj.end.value &&
      moment(obj.start.value) < moment(obj.end.value)
    );
  };

  translateInclusive = str => {
    if (this.hideInclusiveFields) return "";
    let strRet = "(";
    strRet += this.props.record.timePeriod[str].inclusive ? "not " : "";
    strRet += this.incName + ")";
    return strRet;
  };

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
            "DD MMMM"
          )} ${strIncStart} ${this.endName.toLowerCase()} ${dtEnd.format(
            "DD"
          )} ${strIncEnd} ${dtEnd.format("MMMM/YYYY")}.`;
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
      strResult += `${this.startName} ${dtStart.format(
        this.dateFormat
      )} ${strIncStart}.`;
    } else if (dtEnd) {
      strResult += `${this.endName} ${dtEnd.format(
        this.dateFormat
      )} ${strIncEnd}.`;
    }
    return strResult;
  };

  translateDaysDiff = (dtStart, dtEnd) =>
    ` (${this.strDiff} ${dtEnd.diff(dtStart, "days")})`;

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

  translateIncLiteral = str =>
    this.props.record.timePeriod[str].inclusive
      ? this.translateInclusive(str)
      : "";

  parseDtVal = str =>
    this.props.record.timePeriod[str].value
      ? moment(this.props.record.timePeriod[str].value)
      : null;

  render() {
    let strResult = "";
    const dtStart = this.parseDtVal("start");
    const dtEnd = this.parseDtVal("end");
    if (this.props.isLiteralInfo) {
      strResult = this.literalInfo(dtStart, dtEnd);
    } else {
      strResult = this.strictInfo(dtStart, dtEnd);
    }
    return strResult ? strResult : this.strEmpty;
  }
}
